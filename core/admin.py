from django.contrib import admin
from .models import (
	DoctorProfile,
	ClinicSettings,
	NotificationSettings,
	Treatment,
	TreatmentFAQ,
	GalleryImage,
	AppointmentAvailability,
	AppointmentRequest,
	Appointment,
	Inquiry,
)


class TreatmentFAQInline(admin.TabularInline):
	model = TreatmentFAQ
	extra = 1


class GalleryImageInline(admin.TabularInline):
	model = GalleryImage
	extra = 1
	fields = ('title', 'image', 'order')


@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
	list_display = ('title', 'published', 'order')
	list_filter = ('published',)
	search_fields = ('title', 'description')
	prepopulated_fields = {'slug': ('title',)}
	inlines = [TreatmentFAQInline, GalleryImageInline]


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'phone', 'updated_at')
	search_fields = ('name', 'qualifications', 'expertise', 'email')


@admin.register(ClinicSettings)
class ClinicSettingsAdmin(admin.ModelAdmin):
	list_display = ('clinic_name', 'phone', 'email')


@admin.register(NotificationSettings)
class NotificationSettingsAdmin(admin.ModelAdmin):
	list_display = ('notify_new_appointment', 'notify_cancellation', 'notify_inquiry', 'email_notifications')


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
	list_display = ('__str__', 'treatment', 'order', 'uploaded_at')
	list_filter = ('treatment',)
	search_fields = ('title',)


@admin.register(AppointmentAvailability)
class AppointmentAvailabilityAdmin(admin.ModelAdmin):
	list_display = ('date', 'start_time', 'end_time', 'is_blocked')
	list_filter = ('is_blocked', 'date')
	search_fields = ('date',)


def mark_request_approved(modeladmin, request, queryset):
	queryset.update(status='approved')


def mark_request_rejected(modeladmin, request, queryset):
	queryset.update(status='rejected')


@admin.register(AppointmentRequest)
class AppointmentRequestAdmin(admin.ModelAdmin):
	list_display = ('patient_name', 'treatment', 'requested_date', 'requested_time', 'status', 'created_at')
	list_filter = ('status', 'requested_date')
	search_fields = ('patient_name', 'phone', 'email')
	actions = [mark_request_approved, mark_request_rejected]


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
	list_display = ('patient_name', 'treatment', 'date', 'time', 'status', 'created_at')
	list_filter = ('status', 'date', 'treatment')
	search_fields = ('patient_name', 'phone', 'email')


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'phone', 'is_resolved', 'created_at')
	list_filter = ('is_resolved', 'created_at')
	search_fields = ('name', 'email', 'message')
	actions = ['mark_resolved', 'mark_unresolved']

	def mark_resolved(self, request, queryset):
		queryset.update(is_resolved=True)

	def mark_unresolved(self, request, queryset):
		queryset.update(is_resolved=False)

	mark_resolved.short_description = 'Mark selected inquiries as resolved'
	mark_unresolved.short_description = 'Mark selected inquiries as unresolved'

