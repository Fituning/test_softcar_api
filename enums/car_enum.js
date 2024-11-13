// enums/carEnums.js

const VentilationLevel = {
    OFF: 0,
    LEVEL_1: 1,
    LEVEL_2: 2,
    LEVEL_3: 3
};

const AirConditioningMode = {
    OFF: "off",
    MANUEL: "manuel",
    AUTO: "auto"
};

const DoorState = {
    CLOSED: "close",
    OPENED: "open"
};

const SoftwareStatus = {
    UP_TO_DATE: "up_to_date",
    TO_UPDATE: "to_update",
    END_OF_LIFE: "end_of_life",
    OBSOLETE: "obsolete",
    DEPRECATED: "deprecated",
    MAINTENANCE: "maintenance",
    VULNERABLE: "vulnerable"
};

const DaysOfWeek = {
    MONDAY: "MON",
    TUESDAY: "TUE",
    WEDNESDAY: "WED",
    THURSDAY: "THU",
    FRIDAY: "FRI",
    SATURDAY: "SAT",
    SUNDAY: "SUN"
};

module.exports = { VentilationLevel, AirConditioningMode, DoorState, SoftwareStatus, DaysOfWeek };
