drop database moobfleetdev;
create database moobfleetdev;

use moobfleetdev;
create table if not exists accounts
(
    id                 bigint auto_increment
        primary key,
    name               varchar(320)                null,
    email              varchar(320)                null,
    registration       text                        null,
    admission_date     date                        null,
    created_at         datetime                    not null,
    updated_at         datetime                    not null,
    password_digest    text                        null,
    active             tinyint(1)                  null,
    cell_phone         varchar(20)                 null,
    rpush_feedback_id  int                         null,
    hint               text                        null,
    exec_commands      tinyint(1)  default 0       null,
    blocked            tinyint(1)  default 0       null,
    employer           varchar(255)                null,
    push_configuration int         default 0       null,
    distance_traveled  float       default 0       not null,
    display_language   varchar(10) default 'pt-br' null,
    feature_flags      json                        null,
    blocked_reason     varchar(255)                null,
    blocked_by         bigint                      null,
    blocked_at         datetime                    null,
    deleted_reason     varchar(255)                null,
    deleted_at         datetime                    null,
    deleted_by         bigint                      null
)
    charset = utf8;

create index accounts_blocked_by_index
    on accounts (blocked_by);

create index accounts_cell_phone_index
    on accounts (cell_phone);

create index accounts_deleted_by_index
    on accounts (deleted_by);

create index accounts_email_index
    on accounts (email);

create index accounts_name_index
    on accounts (name);

create table if not exists accounts_roles
(
    account_id bigint not null,
    role_id    bigint not null
)
    charset = utf8;

create index index_accounts_roles_on_account_id
    on accounts_roles (account_id);

create index index_accounts_roles_on_role_id
    on accounts_roles (role_id);

create table if not exists active_storage_blobs
(
    id           bigint auto_increment
        primary key,
    `key`        varchar(255) not null,
    filename     varchar(255) not null,
    content_type varchar(255) null,
    metadata     text         null,
    byte_size    bigint       not null,
    checksum     varchar(255) not null,
    created_at   datetime     not null,
    constraint index_active_storage_blobs_on_key
        unique (`key`)
)
    charset = utf8;

create table if not exists active_storage_attachments
(
    id          bigint auto_increment
        primary key,
    name        varchar(255) not null,
    record_type varchar(255) not null,
    record_id   bigint       not null,
    blob_id     bigint       not null,
    created_at  datetime     not null,
    constraint index_active_storage_attachments_uniqueness
        unique (record_type, record_id, name, blob_id),
    constraint fk_rails_c3b3935057
        foreign key (blob_id) references active_storage_blobs (id)
)
    charset = utf8;

create index index_active_storage_attachments_on_blob_id
    on active_storage_attachments (blob_id);

create table if not exists ar_internal_metadata
(
    `key`      varchar(255) not null
        primary key,
    value      varchar(255) null,
    created_at datetime     not null,
    updated_at datetime     not null
)
    charset = utf8;

create table if not exists commands
(
    id           bigint auto_increment
        primary key,
    command_code int          not null,
    name         varchar(255) not null
)
    charset = utf8;

create table if not exists companies
(
    id         bigint auto_increment
        primary key,
    uuid       varchar(36)  not null,
    name       varchar(255) not null,
    updated_at datetime     not null,
    created_at datetime     not null,
    constraint companies_uuid_uindex
        unique (uuid)
)
    charset = utf8;

create index companies_name_index
    on companies (name);

create table if not exists configs
(
    id          bigint auto_increment
        primary key,
    contract_id bigint       null,
    company_id  bigint       null,
    name        varchar(320) null,
    value       text         null,
    created_at  datetime     not null,
    updated_at  datetime     not null
)
    charset = utf8;

create index configs_name_company_id_index
    on configs (name, company_id);

create index configs_name_contract_id_index
    on configs (name, contract_id);

create table if not exists contracts
(
    id           bigint auto_increment
        primary key,
    company_id   bigint       null,
    uuid         varchar(26)  not null,
    name         varchar(255) not null,
    created_at   datetime     not null,
    updated_at   datetime     not null,
    client_token text         null,
    secret_token text         null,
    constraint index_contracts_on_uuid
        unique (uuid),
    constraint fk_rails_676562988a
        foreign key (company_id) references companies (id)
)
    charset = utf8;

create table if not exists accounts_contracts
(
    contract_id bigint not null,
    account_id  bigint not null,
    constraint fk_rails_6bb0f52133
        foreign key (contract_id) references contracts (id),
    constraint fk_rails_d2c020422e
        foreign key (account_id) references accounts (id)
)
    charset = utf8;

create index index_accounts_contracts_on_account_id
    on accounts_contracts (account_id);

create index index_accounts_contracts_on_contract_id
    on accounts_contracts (contract_id);

create table if not exists commands_contracts
(
    contract_id bigint not null,
    command_id  bigint not null,
    constraint fk_rails_42108e469d
        foreign key (contract_id) references contracts (id),
    constraint fk_rails_ff62025613
        foreign key (command_id) references commands (id)
)
    charset = utf8;

create index index_commands_contracts_on_command_id
    on commands_contracts (command_id);

create index index_commands_contracts_on_contract_id
    on commands_contracts (contract_id);

create index contracts_name_index
    on contracts (name);

create index index_contracts_on_company_id
    on contracts (company_id);

create table if not exists feedbacks
(
    id           bigint auto_increment
        primary key,
    account_id   bigint       null,
    device_model text         null,
    os_version   text         null,
    app_version  text         null,
    message      text         null,
    created_at   datetime     not null,
    updated_at   datetime     not null,
    pin          varchar(255) not null,
    constraint fk_rails_7ef0ddae05
        foreign key (account_id) references accounts (id)
)
    charset = utf8;

create table if not exists feedback_comments
(
    id          bigint auto_increment
        primary key,
    response    varchar(500) not null,
    created_at  datetime     not null,
    updated_at  datetime     not null,
    feedback_id bigint       not null,
    account_id  bigint       not null,
    constraint fk_rails_3f287de18c
        foreign key (account_id) references accounts (id),
    constraint fk_rails_4217606e64
        foreign key (feedback_id) references feedbacks (id)
)
    charset = utf8;

create index index_feedbacks_on_account_id
    on feedbacks (account_id);

create table if not exists locations 
(
    id          bigint auto_increment
        primary key,
    contract_id bigint       null,
    description varchar(512) null,
    complement  varchar(128) null,
    latitude    double       null,
    longitude   double       null,
    radius_m    int          null,
    type        int          null,
    icon        text         null,
    constraint location_contracts_id_fk
        foreign key (contract_id) references contracts (id)
);

create index location_complement_index
    on locations (complement);

create index location_description_index
    on locations (description);

create index location_type_index
    on locations (type);

create table if not exists notifications
(
    id         bigint auto_increment
        primary key,
    `group`    varchar(255)         not null,
    title      varchar(255)         not null,
    message    text                 not null,
    image      varchar(255)         null,
    readed     tinyint(1) default 0 null,
    data       text                 not null,
    created_at datetime             not null,
    updated_at datetime             not null
)
    charset = utf8;

create table if not exists notification_accounts
(
    id              bigint auto_increment
        primary key,
    readed          tinyint(1) null,
    account_id      bigint     null,
    notification_id bigint     null,
    created_at      datetime   not null,
    updated_at      datetime   not null,
    constraint fk_rails_23b1affdfd
        foreign key (notification_id) references notifications (id),
    constraint fk_rails_d330534a83
        foreign key (account_id) references accounts (id)
)
    charset = utf8;

create index index_notification_accounts_on_account_id
    on notification_accounts (account_id);

create index index_notification_accounts_on_notification_id
    on notification_accounts (notification_id);

create table if not exists roles
(
    id                bigint auto_increment
        primary key,
    name              varchar(255)         not null,
    authorizable_type varchar(255)         null,
    authorizable_id   bigint               null,
    `system`          tinyint(1) default 0 not null,
    created_at        datetime             not null,
    updated_at        datetime             not null,
    default_flags     json                 null
)
    charset = utf8;

create index index_roles_on_authorizable_type_and_authorizable_id
    on roles (authorizable_type, authorizable_id);

create index index_roles_on_name
    on roles (name);

create table if not exists rpush_apps
(
    id                      bigint auto_increment
        primary key,
    name                    varchar(255)  not null,
    environment             varchar(255)  null,
    certificate             text          null,
    password                varchar(255)  null,
    connections             int default 1 not null,
    created_at              datetime      not null,
    updated_at              datetime      not null,
    type                    varchar(255)  not null,
    auth_key                varchar(255)  null,
    client_id               varchar(255)  null,
    client_secret           varchar(255)  null,
    access_token            varchar(255)  null,
    access_token_expiration datetime      null,
    apn_key                 text          null,
    apn_key_id              varchar(255)  null,
    team_id                 varchar(255)  null,
    bundle_id               varchar(255)  null
)
    charset = utf8;

create table if not exists rpush_feedback
(
    id           bigint auto_increment
        primary key,
    device_token varchar(255)                        null,
    failed_at    timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created_at   datetime                            not null,
    updated_at   datetime                            not null,
    app_id       int                                 null
)
    charset = utf8;

create index index_rpush_feedback_on_device_token
    on rpush_feedback (device_token);

create table if not exists rpush_notifications
(
    id                 bigint auto_increment
        primary key,
    badge              int                      null,
    device_token       varchar(255)             null,
    sound              varchar(255)             null,
    alert              text                     null,
    data               text                     null,
    expiry             int        default 86400 null,
    delivered          tinyint(1) default 0     not null,
    delivered_at       timestamp                null,
    failed             tinyint(1) default 0     not null,
    failed_at          timestamp                null,
    error_code         int                      null,
    error_description  text                     null,
    deliver_after      timestamp                null,
    created_at         datetime                 not null,
    updated_at         datetime                 not null,
    alert_is_json      tinyint(1) default 0     not null,
    type               varchar(255)             not null,
    collapse_key       varchar(255)             null,
    delay_while_idle   tinyint(1) default 0     not null,
    registration_ids   mediumtext               null,
    app_id             int                      not null,
    retries            int        default 0     null,
    uri                varchar(255)             null,
    fail_after         timestamp                null,
    processing         tinyint(1) default 0     not null,
    priority           int                      null,
    url_args           text                     null,
    category           varchar(255)             null,
    content_available  tinyint(1) default 0     not null,
    notification       text                     null,
    mutable_content    tinyint(1) default 0     not null,
    external_device_id varchar(255)             null,
    thread_id          varchar(255)             null
)
    charset = utf8;

create index index_rpush_notifications_multi
    on rpush_notifications (delivered, failed, processing, deliver_after, created_at);

create table if not exists schema_migrations
(
    version varchar(255) not null
        primary key
)
    charset = utf8;

create table if not exists sms_tokens
(
    id         bigint auto_increment
        primary key,
    token      text         null,
    account_id bigint       null,
    expiration datetime     null,
    mode       varchar(255) null,
    constraint fk_rails_e0e5d4c8e3
        foreign key (account_id) references accounts (id)
)
    charset = utf8;

create index index_sms_tokens_on_account_id
    on sms_tokens (account_id);

create table if not exists vehicle_groups
(
    id         bigint auto_increment
        primary key,
    name       text     null,
    created_at datetime not null,
    updated_at datetime not null
)
    charset = utf8;

create table if not exists contracts_vehicle_groups
(
    vehicle_group_id bigint not null,
    contract_id      bigint not null,
    constraint fk_rails_33fe21c561
        foreign key (vehicle_group_id) references vehicle_groups (id),
    constraint fk_rails_8417b4382d
        foreign key (contract_id) references contracts (id)
)
    charset = utf8;

create index index_contracts_vehicle_groups_on_contract_id
    on contracts_vehicle_groups (contract_id);

create index index_contracts_vehicle_groups_on_vehicle_group_id
    on contracts_vehicle_groups (vehicle_group_id);

create table if not exists vehicle_manufacturers
(
    id         bigint auto_increment
        primary key,
    name       text     null,
    created_at datetime not null,
    updated_at datetime not null
)
    charset = utf8;

create table if not exists vehicle_models
(
    id                      bigint auto_increment
        primary key,
    name                    varchar(50) null,
    vehicle_manufacturer_id bigint      null,
    type                    int         null,
    maintenance_km          int         null,
    maintenance_months      int         null,
    photos                  text        null,
    created_at              datetime    not null,
    updated_at              datetime    not null,
    constraint fk_rails_c0a4039da7
        foreign key (vehicle_manufacturer_id) references vehicle_manufacturers (id)
)
    charset = utf8;

create index index_vehicle_models_on_vehicle_manufacturer_id
    on vehicle_models (vehicle_manufacturer_id);

create index vehicle_models_name_index
    on vehicle_models (name);

create table if not exists vehicles
(
    id                          bigint auto_increment
        primary key,
    chassis                     varchar(20)                     null,
    license_plate               varchar(20)                     null,
    renavam                     varchar(20)                     null,
    vehicle_group_id            bigint                          null,
    vehicle_model_id            bigint                          null,
    year_manufacture            int                             null,
    year_model                  int                             null,
    gearshift                   text                            null,
    type_fuel                   varchar(255)                    null,
    tank_fuel                   int                             null,
    created_at                  datetime                        not null,
    updated_at                  datetime                        not null,
    fuel_level                  int                             null,
    color                       text                            null,
    qty_place                   int                             null,
    motorization                varchar(255)                    null,
    status                      varchar(255) default 'INACTIVE' null,
    license_link                text                            null,
    picture_link                text                            null,
    reservation_status          int                             null,
    reservation_id              bigint                          null,
    latitude                    double                          null,
    longitude                   double                          null,
    current_hotspot_id          bigint                          null,
    position_updated_at         datetime                        null,
    speed_kmh                   double                          null,
    odometer_km                 int                             null,
    engine_rpm                  int                             null,
    battery_volts               double                          null,
    ev_battery_level            double                          null,
    ev_range_km                 int                             null,
    telemetry_updated_at        datetime                        null,
    ignition_status             tinyint(1)                      null,
    block_status                tinyint(1)                      null,
    door_status                 tinyint(1)                      null,
    sensors_updated_at          datetime                        null,
    device_status               int                             null,
    devide_serial               varchar(30)                     null,
    device_iccid                varchar(30)                     null,
    device_temp_c               double                          null,
    device_battery_volts        double                          null,
    device_telemetry_updated_at datetime                        null,
    unsolved_damages_qty        int          default 0          null,
    active_alerts_qty           int          default 0          null,
    constraint fk_rails_09031919f3
        foreign key (vehicle_group_id) references vehicle_groups (id),
    constraint fk_rails_83f60c4d50
        foreign key (vehicle_model_id) references vehicle_models (id)
)
    charset = utf8;

create table if not exists command_logs
(
    id          bigint auto_increment
        primary key,
    message     varchar(255) not null,
    channel     varchar(255) not null,
    command_id  bigint       not null,
    vehicle_id  bigint       not null,
    account_id  bigint       not null,
    executed_at datetime     not null,
    constraint fk_rails_30b32f2189
        foreign key (vehicle_id) references vehicles (id),
    constraint fk_rails_52b90c5297
        foreign key (account_id) references accounts (id),
    constraint fk_rails_5573de5e86
        foreign key (command_id) references commands (id)
)
    charset = utf8;

create index index_command_logs_on_account_id
    on command_logs (account_id);

create index index_command_logs_on_command_id
    on command_logs (command_id);

create index index_command_logs_on_vehicle_id
    on command_logs (vehicle_id);

create table if not exists maintenances
(
    id          bigint auto_increment
        primary key,
    vehicle_id  bigint       null,
    account_id  bigint       null,
    created_at  datetime     null,
    type        int          null,
    description varchar(512) null,
    odometer_km int          null,
    constraint maintenances_accounts_id_fk
        foreign key (account_id) references accounts (id),
    constraint maintenances_vehicles_id_fk
        foreign key (vehicle_id) references vehicles (id)
);

create index maintenances_description_index
    on maintenances (description);

create index maintenances_type_index
    on maintenances (type);

create table if not exists reservations
(
    id                       bigint auto_increment
        primary key,
    pin                      varchar(20)     null,
    account_id               bigint          null,
    vehicle_id               bigint          null,
    destiny                  text            null,
    destiny_nickname         varchar(255)    null,
    destiny_latitude         double          null,
    destiny_longitude        double          null,
    date_withdrawal          datetime        null,
    date_devolution          datetime        null,
    qty_people               int             null,
    created_at               datetime        not null,
    updated_at               datetime        not null,
    date_start               datetime        null,
    date_finish              datetime        null,
    status                   int             null,
    uf                       varchar(2)      null,
    time_traveled            int   default 0 not null,
    travelled_distance       float default 0 not null,
    cancellation_reason      int             null,
    cancellation_responsible bigint          null,
    finish_responsible       bigint          null,
    finish_at                datetime        null,
    cancellation_at          datetime        null,
    vehicle_update_at        datetime        null,
    type                     int             null,
    origin_location_id       bigint          null,
    destiny_location_id      bigint          null,
    csv_link                 text            null,
    initial_odometer_km      int             null,
    final_odometer_km        int             null,
    initial_fuel_level       double          null,
    final_fuel_level         double          null,
    constraint fk_rails_e29a3cd569
        foreign key (account_id) references accounts (id),
    constraint fk_rails_fadbcd7cf7
        foreign key (vehicle_id) references vehicles (id)
)
    charset = utf8;

create table if not exists alerts
(
    id             bigint auto_increment
        primary key,
    vehicle_id     bigint   null,
    reservation_id bigint   null,
    alert_id       int      null,
    status         int      null,
    created_at     datetime null,
    created_by     bigint   null,
    updated_at     datetime null,
    updated_by     bigint   null,
    constraint alerts_reservations_id_fk
        foreign key (reservation_id) references reservations (id),
    constraint alerts_vehicles_id_fk
        foreign key (vehicle_id) references vehicles (id)
);

create index alerts_alert_id_index
    on alerts (alert_id);

create index alerts_created_by_index
    on alerts (created_by);

create index alerts_status_index
    on alerts (status);

create index alerts_updated_by_index
    on alerts (updated_by);

create table if not exists checklist
(
    id             bigint auto_increment
        primary key,
    created_at     datetime   null,
    vehicle_id     bigint     null,
    account_id     bigint     null,
    reservation_id bigint     null,
    answers        text       null,
    item1          tinyint(1) null,
    item2          tinyint(1) null,
    item3          tinyint(1) null,
    item4          tinyint(1) null,
    item5          tinyint(1) null,
    item6          tinyint(1) null,
    item7          tinyint(1) null,
    item8          tinyint(1) null,
    item9          tinyint(1) null,
    item10         tinyint(1) null,
    item11         tinyint(1) null,
    item12         tinyint(1) null,
    item13         tinyint(1) null,
    item14         tinyint(1) null,
    item15         tinyint(1) null,
    pictures       text       null,
    constraint checklist_accounts_id_fk
        foreign key (account_id) references accounts (id),
    constraint checklist_reservations_id_fk
        foreign key (reservation_id) references reservations (id),
    constraint checklist_vehicles_id_fk
        foreign key (vehicle_id) references vehicles (id)
);

create table if not exists damages
(
    id             bigint auto_increment
        primary key,
    vehicle_id     bigint               null,
    account_id     bigint               null,
    reservation_id bigint               null,
    active         tinyint(1) default 1 null,
    created_at     datetime             not null,
    updated_at     datetime             not null,
    deleted_at     datetime             null,
    title          varchar(255)         null,
    description    text                 null,
    impeditive     tinyint(1)           null,
    constraint damages_accounts_id_fk
        foreign key (account_id) references accounts (id),
    constraint damages_reservations_id_fk
        foreign key (reservation_id) references reservations (id),
    constraint damages_vehicles_id_fk
        foreign key (vehicle_id) references vehicles (id)
)
    charset = utf8;

create table if not exists contracts_damages
(
    contract_id bigint not null,
    damage_id   bigint not null,
    constraint fk_rails_89e7de4a20
        foreign key (damage_id) references damages (id),
    constraint fk_rails_ecab822565
        foreign key (contract_id) references contracts (id)
)
    charset = utf8;

create index index_contracts_damages_on_contract_id
    on contracts_damages (contract_id);

create index index_contracts_damages_on_damage_id
    on contracts_damages (damage_id);

create table if not exists ratings
(
    id             bigint auto_increment
        primary key,
    value          float default 0 null,
    message        text            null,
    reservation_id bigint          null,
    created_at     datetime        not null,
    updated_at     datetime        not null,
    vehicle_id     bigint          null,
    constraint fk_rails_f257dd1f40
        foreign key (reservation_id) references reservations (id),
    constraint fk_rails_fa7b025646
        foreign key (vehicle_id) references vehicles (id)
)
    charset = utf8;

create index index_ratings_on_reservation_id
    on ratings (reservation_id);

create index index_ratings_on_vehicle_id
    on ratings (vehicle_id);

create table if not exists reservation_accounts
(
    id             bigint auto_increment
        primary key,
    account_id     bigint     null,
    reservation_id bigint     null,
    created_at     datetime   not null,
    updated_at     datetime   not null,
    status         tinyint(1) null,
    message        text       null,
    constraint fk_rails_3c5dbd75da
        foreign key (reservation_id) references reservations (id),
    constraint fk_rails_508bf7a3c9
        foreign key (account_id) references accounts (id)
)
    charset = utf8;

create index index_reservation_accounts_on_account_id
    on reservation_accounts (account_id);

create index index_reservation_accounts_on_reservation_id
    on reservation_accounts (reservation_id);

create index index_reservations_on_account_id
    on reservations (account_id);

create index index_reservations_on_vehicle_id
    on reservations (vehicle_id);

create index reservations_destiny_nickname_index
    on reservations (destiny_nickname);

create index reservations_pin_index
    on reservations (pin);

create table if not exists vehicle_status_log
(
    id         bigint auto_increment
        primary key,
    vehicle_id bigint   null,
    status     int      null,
    created_at datetime null,
    created_by bigint   null,
    constraint vehicle_status_log_accounts_id_fk
        foreign key (created_by) references accounts (id),
    constraint vehicle_status_log_vehicles_id_fk
        foreign key (vehicle_id) references vehicles (id)
);

create index vehicle_status_log_created_at_index
    on vehicle_status_log (created_at);

create index vehicle_status_log_created_by_index
    on vehicle_status_log (created_by);

create index vehicle_status_log_status_index
    on vehicle_status_log (status);

create index index_vehicles_on_vehicle_group_id
    on vehicles (vehicle_group_id);

create index index_vehicles_on_vehicle_model_id
    on vehicles (vehicle_model_id);

create index vehicles_active_alerts_qty_index
    on vehicles (active_alerts_qty);

create index vehicles_chassis_index
    on vehicles (chassis);

create index vehicles_license_plate_index
    on vehicles (license_plate);

create index vehicles_renavam_index
    on vehicles (renavam);

create index vehicles_unsolved_damages_qty_index
    on vehicles (unsolved_damages_qty);

