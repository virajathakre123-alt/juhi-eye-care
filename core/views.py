import json
import logging
from datetime import datetime
from urllib.parse import quote

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from .models import Appointment, AppointmentRequest, Treatment


logger = logging.getLogger(__name__)


def _corsify(response):
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Vary'] = 'Origin'
    return response


def _cors_preflight():
    return _corsify(JsonResponse({'success': True}))


def _normalize_phone(phone):
    if not phone:
        return ''
    digits = ''.join(ch for ch in phone if ch.isdigit())
    if len(digits) == 10:
        digits = '91' + digits
    elif len(digits) == 11 and digits.startswith('0'):
        digits = '91' + digits[1:]
    return digits


def _get_or_create_treatment(title):
    title = (title or '').strip()
    if not title:
        return None

    slug = slugify(title)
    # Avoid using field-lookups (like __iexact) in get_or_create which raises a FieldError.
    # First try a case-insensitive match, otherwise create a new Treatment.
    treatment = Treatment.objects.filter(title__iexact=title).first()
    if treatment:
        return treatment

    # Create a new treatment record with the provided title and slug
    treatment = Treatment.objects.create(title=title, slug=slug)
    return treatment


def _parse_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except ValueError:
        return None


def _parse_time(value):
    if not value:
        return None
    try:
        return datetime.strptime(value.strip(), '%I:%M %p').time()
    except ValueError:
        return None


def _send_confirmation_email(appointment_request):
    if not appointment_request.email:
        return

    clinic_name = getattr(settings, 'CLINIC_NAME', 'Juhi Eye Care')
    appointment_date = appointment_request.requested_date.strftime('%d %b %Y') if appointment_request.requested_date else 'TBD'
    appointment_time = appointment_request.requested_time.strftime('%I:%M %p') if appointment_request.requested_time else 'TBD'
    treatment_title = appointment_request.treatment.title if appointment_request.treatment else ''
    subject = f'Appointment Approved – {clinic_name}'
    message = (
        f'Hello {appointment_request.patient_name},\n\n'
        f'Your appointment request has been approved and confirmed.\n\n'
        f'Date: {appointment_date}\n'
        f'Time: {appointment_time}\n'
        f'Treatment: {treatment_title}\n\n'
        f'Please arrive 10 minutes before your scheduled time.\n\n'
        f'Thank you for choosing {clinic_name}.\n'
    )
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or getattr(settings, 'EMAIL_HOST_USER', None) or 'virajthakre12@gmail.com'
    send_mail(subject, message, from_email, [appointment_request.email], fail_silently=False)


def _send_request_received_email(appointment_request):
    if not appointment_request.email:
        return

    clinic_name = getattr(settings, 'CLINIC_NAME', 'Juhi Eye Care')
    appointment_date = appointment_request.requested_date.strftime('%d %b %Y') if appointment_request.requested_date else 'TBD'
    appointment_time = appointment_request.requested_time.strftime('%I:%M %p') if appointment_request.requested_time else 'TBD'
    treatment_title = appointment_request.treatment.title if appointment_request.treatment else 'General Consultation'
    subject = f'Appointment Request Received – {clinic_name}'
    message = (
        f'Hello {appointment_request.patient_name},\n\n'
        f'Welcome to {clinic_name}! Your appointment request has been sent to our doctor for review.\n\n'
        f'Appointment details:\n'
        f'Date: {appointment_date}\n'
        f'Time: {appointment_time}\n'
        f'Treatment: {treatment_title}\n\n'
        'We will inform you by email once the doctor approves your appointment.\n\n'
        'Thank you for choosing Juhi Eye Care.\n'
    )
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or getattr(settings, 'EMAIL_HOST_USER', None) or 'virajthakre12@gmail.com'
    send_mail(subject, message, from_email, [appointment_request.email], fail_silently=False)


def _build_whatsapp_url(phone, appointment_request):
    normalized = _normalize_phone(phone)
    if not normalized:
        return ''
    appointment_date = appointment_request.requested_date.strftime('%d %b %Y') if appointment_request.requested_date else 'TBD'
    appointment_time = appointment_request.requested_time.strftime('%I:%M %p') if appointment_request.requested_time else 'TBD'
    treatment_title = appointment_request.treatment.title if appointment_request.treatment else ''
    text = (
        f'Hello {appointment_request.patient_name}, your appointment at Juhi Eye Care is confirmed for {appointment_date} at {appointment_time}'
        f'{" for " + treatment_title if treatment_title else ""}. Please arrive 10 minutes early.'
    )
    return f'https://wa.me/{normalized}?text={quote(text)}'


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def submit_appointment_request(request):
    if request.method == 'OPTIONS':
        return _cors_preflight()

    try:
        payload = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return _corsify(JsonResponse({'success': False, 'error': 'Invalid JSON payload.'}, status=400))

    patient_name = payload.get('full_name', '').strip()
    phone = payload.get('phone', '').strip()
    email = payload.get('email', '').strip()
    treatment_title = payload.get('treatment', '').strip()
    requested_date = _parse_date(payload.get('appointment_date'))
    requested_time = _parse_time(payload.get('appointment_time'))
    message = payload.get('message', '').strip()

    if not patient_name or not requested_date or not requested_time:
        return _corsify(JsonResponse({'success': False, 'error': 'Name, date and time are required.'}, status=400))

    try:
        treatment = _get_or_create_treatment(treatment_title)
        appointment_request = AppointmentRequest.objects.create(
            patient_name=patient_name,
            phone=phone,
            email=email,
            treatment=treatment,
            requested_date=requested_date,
            requested_time=requested_time,
            message=message,
            status='pending'
        )
    except Exception:
        logger.exception('Unable to submit appointment request')
        return _corsify(JsonResponse({
            'success': False,
            'error': 'We could not complete your booking right now. Please try again in a moment.'
        }, status=500))

    try:
        _send_request_received_email(appointment_request)
    except Exception:
        logger.exception('Appointment saved, but acknowledgement email could not be sent')

    return _corsify(JsonResponse({'success': True, 'id': appointment_request.id}, status=201))


@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def pending_appointment_requests(request):
    if request.method == 'OPTIONS':
        return _cors_preflight()

    pending_requests = AppointmentRequest.objects.filter(status='pending').order_by('created_at')
    data = []
    for appt in pending_requests:
        data.append({
            'id': appt.id,
            'patient_name': appt.patient_name,
            'phone': appt.phone,
            'email': appt.email,
            'treatment': appt.treatment.title if appt.treatment else '',
            'requested_date': appt.requested_date.strftime('%Y-%m-%d') if appt.requested_date else '',
            'requested_time': appt.requested_time.strftime('%I:%M %p') if appt.requested_time else '',
            'message': appt.message,
            'created_at': appt.created_at.isoformat(),
        })
    return _corsify(JsonResponse({'success': True, 'requests': data}))


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def approve_appointment_request(request, pk):
    if request.method == 'OPTIONS':
        return _cors_preflight()

    appointment_request = get_object_or_404(AppointmentRequest, pk=pk)

    if appointment_request.status != 'pending':
        return _corsify(JsonResponse({'success': False, 'error': 'Only pending requests can be approved.'}, status=400))

    appointment_request.status = 'approved'
    appointment_request.save()

    Appointment.objects.get_or_create(
        patient_name=appointment_request.patient_name,
        phone=appointment_request.phone,
        email=appointment_request.email,
        treatment=appointment_request.treatment,
        date=appointment_request.requested_date,
        time=appointment_request.requested_time,
        defaults={'status': 'confirmed'}
    )

    try:
        _send_confirmation_email(appointment_request)
    except Exception:
        pass

    whatsapp_url = _build_whatsapp_url(appointment_request.phone, appointment_request)
    return _corsify(JsonResponse({'success': True, 'whatsapp_url': whatsapp_url}))


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def reject_appointment_request(request, pk):
    if request.method == 'OPTIONS':
        return _cors_preflight()

    appointment_request = get_object_or_404(AppointmentRequest, pk=pk)

    if appointment_request.status != 'pending':
        return _corsify(JsonResponse({'success': False, 'error': 'Only pending requests can be rejected.'}, status=400))

    appointment_request.status = 'rejected'
    appointment_request.save()
    return _corsify(JsonResponse({'success': True}))
