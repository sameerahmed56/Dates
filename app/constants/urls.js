// const BASE_URL = "https://tech.kiet.edu/api/hrms/";
// const BASE_URL = "http://64634edb40ef.ngrok.io/"
const BASE_URL = "http://9cc62c385af3.ngrok.io/"
export default {
    "LOGIN": BASE_URL + "validate/",
    "UPLOAD_FILE": BASE_URL + "dashboard/upload/",
    "UPLOAD_FILE": BASE_URL + "dashboard/upload/",
    "UPLOAD_IMAGE": BASE_URL + "dashboard/upload/",
    //fcm
    "FCM_INSERT": BASE_URL + 'fcm_insert/',
    "FCM_DELETE": BASE_URL + 'fcm_remove/',

    //dashboard 
    "MONTHLY_RESPONSE": BASE_URL + "leave/monthlyreport/",
    "LEAVES_REMAINING": BASE_URL + "leave/get_leaves_remaining/",

    //profile
    "EMPLOYEE_INFO": BASE_URL + "dashboard/view_profile/",
    "EDIT_PROFILE": BASE_URL + "dashboard/edit_profile/",

    //previous leave
    "REQUEST_LEAVES": BASE_URL + "leave/leaveapproval/?request_type=action",
    "PREVIOUS_NORMAL_LEAVES": BASE_URL + "leave/view_previous_leave/?request_by=employee&request_type=normal",
    "PREVIOUS_OD_LEAVES": BASE_URL + "leave/view_previous_leave/?request_by=employee&request_type=od",
    "PREVIOUS_COMPOFF_LEAVES": BASE_URL + "leave/view_previous_leave/?request_by=employee&request_type=compoff",
    "CANCEL_LEAVE": BASE_URL + "leave/cancel_leave/",
    "APPROVE_REJECT_LEAVE": BASE_URL + "leave/leaveapproval/",
    //normal
    "GET_NORMAL_SUB_CATEGORY": BASE_URL + "leave/genderwise_leaves/?request_type=employee",
    "APPLY_NORMAL_LEAVE": BASE_URL + "leave/normal_leave_employee_insert/",
    //compOff
    "GET_COMP_OFF_DATA": BASE_URL + "leave/compoff_data/?request_type=employee",
    "APPLY_COMP_OFF_LEAVE": BASE_URL + "leave/comp_off_employee_insert/",
    //od
    "GET_OD_CATEGORY": BASE_URL + "leave/OD/?request_type=OdValues",
    "GET_OD_SUB_CATEGORY": BASE_URL + "leave/OD/?request_type=GetSubCatFromCat",
    "APPLY_OD_LEAVE": BASE_URL + "leave/od_leave_employee_insert/",

    //single person attendance 
    "SINGLE_PERSON_ATTENDANCE": BASE_URL + "attendance/singlepersonatt/",

    //grievance 
    "GRIEVANCE_DATA_RESPONSE": BASE_URL + "grievance/g_formdata/",
    "APPLY_GRIEVANCE": BASE_URL + "grievance/g_formdata/",
    "PREVIOUS_GRIEVANCE": BASE_URL + "grievance/g_view/",
    "REQUEST_GRIEVANCE": BASE_URL + "grievance/g_app1",
    "GRIEVANCE_APPROVE_REJECT": BASE_URL + "grievance/g_insert_app1/",
    "GRIEVANCE_FEEDBACK": BASE_URL + "grievance/g_feedback/",

    //select employee
    "SELECT_EMPLOYEE": BASE_URL + "StudentAcademics/getComponents/?request_type=filtered_emp&dept=ALL",

    //redressal
    "GET_REDRESSAL": BASE_URL + "Redressal/CoordinatorApprove/?request_type=form_data",
    "REDRESSAL_CLOSE_FORWARD": BASE_URL + "Redressal/CoordinatorApprove/",

    //ticketing
    "PREVIOUS_TICKETS": BASE_URL + "Ticketing/TicketingInsert/?request_type=view_previous",
    "GET_TICKETS": BASE_URL + "Ticketing/CoordinatorApprove/?request_type=form_data",
    "TICKETING_CATEGORY_TYPES": BASE_URL + "Ticketing/getComponents/?request_type=category",
    "TICKETING_PRIORITY_TYPES": BASE_URL + "Ticketing/getComponents/?request_type=priority",
    "TICKETING_SUB_CATEGORY": BASE_URL + "Ticketing/getComponents/?request_type=sub_category",
    "SEND_TICKET": BASE_URL + "Ticketing/TicketingInsert/",
    "TICKET_CLOSE_FORWARD": BASE_URL + "Ticketing/CoordinatorApprove/",

    //kiet digital directory
    "DIGITAL_DIRECTORY": BASE_URL + 'StudentAcademics/emp_details/',
    //kiet extensions
    "GET_KIET_EXTENSIONS": BASE_URL + "musterroll/extension_data/?request_type=get_data",
}
