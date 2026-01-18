export const TASK_PERMISSIONS = {
  ADMIN: {
    CREATE_TASK: true,
    DELETE_TASK: true,
    EDIT_TITLE: true,
    EDIT_DESCRIPTION: true,
    EDIT_ASSIGNED_TO: true,
    EDIT_DEPARTMENT: true,
    EDIT_STATUS: true,
    EDIT_START_DATE: true,
    EDIT_WORK_DESCRIPTION: true,
    
    // TimeEntry
    CREATE_TIME_ENTRY: true,
    DELETE_TIME_ENTRY: true,
    VIEW_TIME_ENTRIES: true,
    
    VIEW_ALL_TASKS: true,
    VIEW_TIME_REPORTS: true,
    EXPORT_REPORTS: true,
  },

  EMPLOYEE: {
    CREATE_TASK: false,
    DELETE_TASK: false,
    EDIT_TITLE: false,
    EDIT_DESCRIPTION: false,
    EDIT_ASSIGNED_TO: false,
    EDIT_DEPARTMENT: false,
    EDIT_STATUS: true,
    EDIT_START_DATE: true,
    EDIT_WORK_DESCRIPTION: true,
    
    // TimeEntry - EMPLOYEE puede registrar su propio tiempo
    CREATE_TIME_ENTRY: true,
    DELETE_TIME_ENTRY: true,  // Solo los suyos
    VIEW_TIME_ENTRIES: true,   // Solo los de sus tareas
    
    VIEW_ALL_TASKS: false,
    VIEW_TIME_REPORTS: false,
    EXPORT_REPORTS: false,
  },
};

export const FORBIDDEN_FIELDS_FOR_EMPLOYEE = [
  "title",
  "description",
  "assignedToId",
  "departmentId",
  "hoursSpent", // ← No editar directamente, se calcula
];

export const EDITABLE_FIELDS_FOR_EMPLOYEE = [
  "status",
  "startDate",
  "workDescription",
];