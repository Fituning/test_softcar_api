const Theme = {
    LIGHT: "light",
    DARK: "dark",
}

const NotificationMode = {
    ON : "on",
    OFF : "off",
    ONLY_ALERT : "only_alert",
}


// Enum des noms de rôles utilisés pour l'enregistrement
const UserRole = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    MODERATOR: "moderator",
    USER: "user"
};


// Niveaux d'accès associés aux rôles pour la comparaison
const RoleLevels = {
    [UserRole.SUPER_ADMIN]: 3,
    [UserRole.ADMIN]: 2,
    [UserRole.MODERATOR]: 1,
    [UserRole.USER]: 0
};




module.exports = { Theme, NotificationMode, UserRole, RoleLevels };
