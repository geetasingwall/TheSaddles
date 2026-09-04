import axios from 'axios';
import type { ApiResponse, User, TrialSlot, TrialBooking, Registration, Student, Coach, Horse, Facility, TeamMember, Testimonial, ClubLocation, AdminDashboard, ProgressRecord, AttendanceRecord, Batch } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

const unwrap = <T>(res: { data: ApiResponse<T> }): ApiResponse<T> => res.data;

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (mobile_number: string) => api.post<ApiResponse<User>>('/auth/login', { mobile_number }).then(unwrap),
  logout: () => api.post<ApiResponse>('/auth/logout').then(unwrap),
};

// ─── Public ────────────────────────────────────────────────────────────────
export const publicApi = {
  getConfig: () => api.get<ApiResponse>('/public/configuration').then(unwrap),
  getHorses: () => api.get<ApiResponse<Horse[]>>('/public/horses').then(unwrap),
  getHorseDetail: (id: string) => api.get<ApiResponse>(`/horses/${id}`).then(unwrap),
  getFacilities: () => api.get<ApiResponse<Facility[]>>('/public/facilities').then(unwrap),
  getTeam: () => api.get<ApiResponse<TeamMember[]>>('/public/team').then(unwrap),
  getTestimonials: () => api.get<ApiResponse<Testimonial[]>>('/public/testimonials').then(unwrap),
  submitTestimonial: (data: { customer_name: string; customer_type: string; rating: number; testimonial: string }) =>
    api.post<ApiResponse>('/public/testimonials', { ...data, show_on_homepage: true }).then(unwrap),
  getLocations: () => api.get<ApiResponse<ClubLocation[]>>('/public/locations').then(unwrap),
};

// ─── Gallery ──────────────────────────────────────────────────────────────
export const galleryApi = {
  getAll: () => api.get<ApiResponse>('/gallery').then(unwrap),
};

// ─── Trial Bookings ────────────────────────────────────────────────────────
export const bookingApi = {
  getDates: () => api.get<ApiResponse>('/trial-bookings/dates').then(unwrap),
  getSlots: (date: string) => api.get<ApiResponse<TrialSlot[]>>(`/trial-bookings/slots?date=${date}`).then(unwrap),
  create: (data: { full_name: string; mobile_number: string; place: string; booking_date: string; start_time: string; end_time: string; number_of_participants: number }) =>
    api.post<ApiResponse<TrialBooking>>('/trial-bookings', data).then(unwrap),
  getById: (id: string) => api.get<ApiResponse<TrialBooking>>(`/trial-bookings/${id}`).then(unwrap),
  cancel: (id: string) => api.patch<ApiResponse>(`/trial-bookings/${id}/cancel`).then(unwrap),
};

// ─── Registrations ─────────────────────────────────────────────────────────
export const registrationApi = {
  create: (data: Partial<Registration> & { first_name: string; mobile_number: string }) =>
    api.post<ApiResponse<{ registration_id: string; status: string }>>('/registrations', data).then(unwrap),
  checkStatus: (mobile_number: string) =>
    api.get<ApiResponse<{ status: string; registration_id: string }>>(`/registrations/status?mobile_number=${mobile_number}`).then(unwrap),
};

// ─── Student ───────────────────────────────────────────────────────────────
export const studentApi = {
  getDashboard: (student_id: string) => api.get<ApiResponse>(`/students/dashboard?student_id=${student_id}`).then(unwrap),
  getProfile: (student_id: string) => api.get<ApiResponse<Student>>(`/students/profile?student_id=${student_id}`).then(unwrap),
  getAttendance: (student_id: string) => api.get<ApiResponse>(`/students/attendance?student_id=${student_id}`).then(unwrap),
  getFees: (student_id: string) => api.get<ApiResponse>(`/students/fees?student_id=${student_id}`).then(unwrap),
  getProgress: (student_id: string) => api.get<ApiResponse<ProgressRecord[]>>(`/students/progress?student_id=${student_id}`).then(unwrap),
  getVideos: (student_id: string) => api.get<ApiResponse>(`/students/videos?student_id=${student_id}`).then(unwrap),
};

// ─── Coach ─────────────────────────────────────────────────────────────────
export const coachApi = {
  getDashboard: (coach_id: string) => api.get<ApiResponse>(`/coach/dashboard?coach_id=${coach_id}`).then(unwrap),
  getStudents: (coach_id: string) => api.get<ApiResponse>(`/coach/students?coach_id=${coach_id}`).then(unwrap),
  markAttendance: (coach_id: string, data: { attendance_date: string; batch_id: string; records: { student_id: string; status: string }[] }) =>
    api.post<ApiResponse>(`/coach/attendance?coach_id=${coach_id}`, data).then(unwrap),
  addProgress: (coach_id: string, data: Partial<ProgressRecord> & { student_id: string; assessment_date: string; riding_level: string }) =>
    api.post<ApiResponse>(`/coach/progress?coach_id=${coach_id}`, data).then(unwrap),
  getStudentProgress: (student_id: string) => api.get<ApiResponse<ProgressRecord[]>>(`/coach/students/${student_id}/progress`).then(unwrap),
  getTrialBookings: (coach_id: string) => api.get<ApiResponse>(`/coach/trial-bookings?coach_id=${coach_id}`).then(unwrap),
  getAttendance: (coach_id: string) => api.get<ApiResponse>(`/coach/attendance?coach_id=${coach_id}`).then(unwrap),
  completeTrialBooking: (id: string) => api.patch<ApiResponse>(`/coach/trial-bookings/${id}/complete`).then(unwrap),
};

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get<ApiResponse<AdminDashboard>>('/admin/dashboard').then(unwrap),
  getRegistrations: (status?: string) => api.get<ApiResponse<Registration[]>>(`/admin/registrations${status ? `?status=${status}` : ''}`).then(unwrap),
  approveRegistration: (id: string, admin_id: string, data: { batch_id?: string; monthly_fee?: number }) =>
    api.patch<ApiResponse>(`/admin/registrations/${id}/approve?admin_id=${admin_id}`, data).then(unwrap),
  rejectRegistration: (id: string, admin_id: string, reason?: string) =>
    api.patch<ApiResponse>(`/admin/registrations/${id}/reject?admin_id=${admin_id}`, { rejection_reason: reason }).then(unwrap),
  getStudents: () => api.get<ApiResponse<Student[]>>('/admin/students').then(unwrap),
  deleteStudent: (id: string) => api.delete<ApiResponse>(`/admin/students/${id}`).then(unwrap),
  updateStudentStatus: (id: string, membership_status: string) => api.patch<ApiResponse>(`/admin/students/${id}/status`, { membership_status }).then(unwrap),
  getCoaches: () => api.get<ApiResponse<Coach[]>>('/admin/coaches').then(unwrap),
  createCoach: (data: Partial<Coach> & { first_name: string; mobile_number: string }) => api.post<ApiResponse>('/admin/coaches', data).then(unwrap),
  updateCoach: (id: string, data: Partial<Coach>) => api.patch<ApiResponse>(`/admin/coaches/${id}`, data).then(unwrap),
  deleteCoach: (id: string) => api.delete<ApiResponse>(`/admin/coaches/${id}`).then(unwrap),
  getTrialBookings: () => api.get<ApiResponse<TrialBooking[]>>('/admin/trial-bookings').then(unwrap),
  getHorses: () => api.get<ApiResponse<Horse[]>>('/admin/horses').then(unwrap),
  createHorse: (data: Partial<Horse> & { stable_name: string }) => api.post<ApiResponse>('/admin/horses', data).then(unwrap),
  updateHorse: (id: string, data: Partial<Horse>) => api.patch<ApiResponse>(`/admin/horses/${id}`, data).then(unwrap),
  deleteHorse: (id: string) => api.delete<ApiResponse>(`/admin/horses/${id}`).then(unwrap),
  uploadHorseGallery: (id: string, file: File) => {
    const form = new FormData(); form.append('file', file);
    return api.post<ApiResponse>(`/admin/horses/${id}/gallery`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);
  },
  deleteHorseGalleryPhoto: (id: string, index: number) => api.delete<ApiResponse>(`/admin/horses/${id}/gallery/${index}`).then(unwrap),
  uploadHorseImage: (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<ApiResponse>(`/admin/horses/${id}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);
  },
  getFacilities: () => api.get<ApiResponse<Facility[]>>('/admin/facilities').then(unwrap),
  createFacility: (data: Partial<Facility> & { facility_name: string }) => api.post<ApiResponse>('/admin/facilities', data).then(unwrap),
  updateFacility: (id: string, data: Partial<Facility>) => api.patch<ApiResponse>(`/admin/facilities/${id}`, data).then(unwrap),
  getTeam: () => api.get<ApiResponse<TeamMember[]>>('/admin/team').then(unwrap),
  createTeamMember: (data: Partial<TeamMember> & { first_name: string; designation: string }) => api.post<ApiResponse>('/admin/team', data).then(unwrap),
  updateTeamMember: (id: string, data: Partial<TeamMember>) => api.patch<ApiResponse>(`/admin/team/${id}`, data).then(unwrap),
  getTestimonials: () => api.get<ApiResponse<Testimonial[]>>('/admin/testimonials').then(unwrap),
  createTestimonial: (data: Partial<Testimonial> & { customer_name: string; customer_type: string; rating: number; testimonial: string }) =>
    api.post<ApiResponse>('/admin/testimonials', data).then(unwrap),
  updateTestimonial: (id: string, data: Partial<Testimonial>) => api.patch<ApiResponse>(`/admin/testimonials/${id}`, data).then(unwrap),
  approveTestimonial: (id: string) => api.patch<ApiResponse>(`/admin/testimonials/${id}/approve`).then(unwrap),
  getLocations: () => api.get<ApiResponse<ClubLocation[]>>('/admin/locations').then(unwrap),
  createLocation: (data: Partial<ClubLocation> & { branch_name: string; address_line_1: string; city: string; state: string }) =>
    api.post<ApiResponse>('/admin/locations', data).then(unwrap),
  updateLocation: (id: string, data: Partial<ClubLocation>) => api.patch<ApiResponse>(`/admin/locations/${id}`, data).then(unwrap),
  getConfiguration: () => api.get<ApiResponse>('/admin/configuration').then(unwrap),
  updateConfiguration: (category: string, key: string, data: Record<string, unknown>) =>
    api.patch<ApiResponse>(`/admin/configuration/${category}/${key}`, data).then(unwrap),
  getBatches: () => api.get<ApiResponse<Batch[]>>('/admin/batches').then(unwrap),
  createBatch: (data: Partial<Batch> & { batch_name: string; coach_id: string; training_day: string; start_time: string; end_time: string }) =>
    api.post<ApiResponse>('/admin/batches', data).then(unwrap),
  updateBatch: (id: string, data: { training_day?: string; batch_name?: string; coach_id?: string; start_time?: string; end_time?: string }) =>
    api.patch<ApiResponse>(`/admin/batches/${id}`, data).then(unwrap),
  deleteBatch: (id: string) => api.delete<ApiResponse>(`/admin/batches/${id}`).then(unwrap),
  recordFeePayment: (data: { student_id: string; payment_date: string; payment_for_month: string; amount_paid: number; payment_mode: string }) =>
    api.post<ApiResponse>('/admin/fees', data).then(unwrap),
  getStudentFees: (student_id: string) => api.get<ApiResponse>(`/admin/fees/${student_id}`).then(unwrap),
  getStudentProgress: (student_id: string) => api.get<ApiResponse>(`/admin/students/${student_id}/progress`).then(unwrap),
  updateStudentFee: (student_id: string, monthly_fee: number) => api.patch<ApiResponse>(`/admin/students/${student_id}/fee?monthly_fee=${monthly_fee}`).then(unwrap),
  getStudentVideos: (student_id: string) => api.get<ApiResponse>(`/admin/students/${student_id}/videos`).then(unwrap),
  addStudentVideo: (student_id: string, data: { title: string; url: string; display_order?: number }) => api.post<ApiResponse>(`/admin/students/${student_id}/videos`, data).then(unwrap),
  deleteStudentVideo: (student_id: string, link_id: string) => api.delete<ApiResponse>(`/admin/students/${student_id}/videos/${link_id}`).then(unwrap),
  getStudentPhotos: (student_id: string) => api.get<ApiResponse>(`/admin/students/${student_id}/photos`).then(unwrap),
  uploadStudentPhoto: (student_id: string, file: File, caption?: string) => {
    const form = new FormData();
    form.append('file', file);
    const url = `/admin/students/${student_id}/photos${caption ? `?caption=${encodeURIComponent(caption)}` : ''}`;
    return api.post<ApiResponse>(url, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);
  },
  deleteStudentPhoto: (student_id: string, photo_id: string) => api.delete<ApiResponse>(`/admin/students/${student_id}/photos/${photo_id}`).then(unwrap),
  assignStudentBatch: (student_id: string, batch_id: string) =>
    api.patch<ApiResponse>(`/admin/students/${student_id}/batch${batch_id ? `?batch_id=${batch_id}` : ''}`).then(unwrap),
  getAttendance: () => api.get<ApiResponse>('/admin/attendance').then(unwrap),
  getLeaseEvents: () => api.get<ApiResponse>('/admin/configuration').then(unwrap),
};
