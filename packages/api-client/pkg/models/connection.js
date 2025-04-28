// connection.model.ts
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["PENDING"] = "pending";
    ConnectionStatus["ACCEPTED"] = "accepted";
    ConnectionStatus["DECLINED"] = "declined";
    ConnectionStatus["BLOCKED"] = "blocked";
})(ConnectionStatus || (ConnectionStatus = {}));
export var RequestDirection;
(function (RequestDirection) {
    RequestDirection["OUTGOING"] = "outgoing";
    RequestDirection["INCOMING"] = "incoming";
})(RequestDirection || (RequestDirection = {}));
export var NotificationPreference;
(function (NotificationPreference) {
    NotificationPreference["ALL"] = "all";
    NotificationPreference["NONE"] = "none";
    NotificationPreference["CONNECTIONS_ONLY"] = "connections_only";
})(NotificationPreference || (NotificationPreference = {}));
