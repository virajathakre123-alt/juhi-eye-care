from django.db import models
from django.utils.text import slugify


class DoctorProfile(models.Model):
    name = models.CharField(max_length=200)
    qualifications = models.TextField(blank=True)
    introduction = models.TextField(blank=True)
    expertise = models.TextField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    whatsapp = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    image = models.ImageField(upload_to='doctor/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ClinicSettings(models.Model):
    clinic_name = models.CharField(max_length=200, default='Juhi Eye Care')
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    whatsapp = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    working_days = models.CharField(max_length=200, blank=True, help_text='Comma separated days e.g. monday,tuesday')

    def __str__(self):
        return self.clinic_name


class NotificationSettings(models.Model):
    notify_new_appointment = models.BooleanField(default=True)
    notify_cancellation = models.BooleanField(default=True)
    notify_inquiry = models.BooleanField(default=False)
    email_notifications = models.BooleanField(default=True)

    def __str__(self):
        return 'Notification Settings'


class Treatment(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='treatments/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class TreatmentFAQ(models.Model):
    treatment = models.ForeignKey(Treatment, related_name='faqs', on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"FAQ: {self.question[:40]}"


class GalleryImage(models.Model):
    title = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='gallery/')
    treatment = models.ForeignKey(Treatment, related_name='gallery', on_delete=models.SET_NULL, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-uploaded_at']

    def __str__(self):
        return self.title or f"Image {self.id}"


class AppointmentAvailability(models.Model):
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_blocked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('date', 'start_time', 'end_time')

    def __str__(self):
        return f"Availability {self.date} {self.start_time}-{self.end_time}"


class AppointmentRequest(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')]
    patient_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    treatment = models.ForeignKey(Treatment, null=True, blank=True, on_delete=models.SET_NULL)
    requested_date = models.DateField(null=True, blank=True)
    requested_time = models.TimeField(null=True, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.patient_name} - {self.status}"


class Appointment(models.Model):
    STATUS_CHOICES = [('confirmed', 'Confirmed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')]
    patient_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    treatment = models.ForeignKey(Treatment, null=True, blank=True, on_delete=models.SET_NULL)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('date', 'time', 'treatment', 'phone')

    def __str__(self):
        return f"{self.patient_name} — {self.date} {self.time}"


class Inquiry(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name}"
from django.db import models

# Create your models here.
