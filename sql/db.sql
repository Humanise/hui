
    alter table "user" 
        drop constraint FK36EBCBE94A3D71;

    alter table application 
        drop constraint FK5CA40550E94A3D71;

    alter table compounddocument 
        drop constraint FK2E80BFC6E94A3D71;

    alter table emailaddress 
        drop constraint FK5CF248D8E94A3D71;

    alter table entity 
        drop constraint FKB29DE3E3165C5561;

    alter table event 
        drop constraint FK5C6729AE94A3D71;

    alter table headerpart 
        drop constraint FK75EB3800E94A3D71;

    alter table htmlpart 
        drop constraint FKEBF39E1EE94A3D71;

    alter table image 
        drop constraint FK5FAA95BE94A3D71;

    alter table imagegallery 
        drop constraint FKB4BCA197E94A3D71;

    alter table imagepart 
        drop constraint FKCBB4E7CEE94A3D71;

    alter table invitation 
        drop constraint FK473F7799E94A3D71;

    alter table person 
        drop constraint FKC4E39B55E94A3D71;

    alter table phonenumber 
        drop constraint FKEF7FCE37E94A3D71;

    alter table property 
        drop constraint FKC4CDDDD559D64C8B;

    alter table relation 
        drop constraint FKDEF3F9FCAC959B89;

    alter table relation 
        drop constraint FKDEF3F9FCCFFF80E;

    alter table relation 
        drop constraint FKDEF3F9FC165C5561;

    alter table topic 
        drop constraint FK696CD2FE94A3D71;

    alter table webnode 
        drop constraint FK48F7AF56E94A3D71;

    alter table webpage 
        drop constraint FK48F863E3E94A3D71;

    alter table website 
        drop constraint FK48F9E09BE94A3D71;

    alter table webstructure 
        drop constraint FKDE88E09FE94A3D71;

    drop table "user";

    drop table application;

    drop table compounddocument;

    drop table emailaddress;

    drop table entity;

    drop table event;

    drop table headerpart;

    drop table htmlpart;

    drop table image;

    drop table imagegallery;

    drop table imagepart;

    drop table invitation;

    drop table item;

    drop table person;

    drop table phonenumber;

    drop table privilege;

    drop table property;

    drop table relation;

    drop table topic;

    drop table webnode;

    drop table webpage;

    drop table website;

    drop table webstructure;

    drop sequence item_id_sequence;

    drop sequence privilege_id_sequence;

    drop sequence property_id_sequence;

    create table "user" (
        id int8 not null,
        username varchar(255),
        password varchar(255),
        primary key (id)
    );

    create table application (
        id int8 not null,
        primary key (id)
    );

    create table compounddocument (
        id int8 not null,
        structure varchar(4000),
        primary key (id)
    );

    create table emailaddress (
        id int8 not null,
        address varchar(255),
        context varchar(255),
        primary key (id)
    );

    create table entity (
        id int8 not null,
        name varchar(255),
        primary key (id)
    );

    create table event (
        id int8 not null,
        startTime timestamp,
        endTime timestamp,
        location varchar(255),
        primary key (id)
    );

    create table headerpart (
        id int8 not null,
        text varchar(4000),
        primary key (id)
    );

    create table htmlpart (
        id int8 not null,
        html varchar(4000),
        primary key (id)
    );

    create table image (
        id int8 not null,
        fileSize int8,
        contentType varchar(255),
        width int4,
        height int4,
        primary key (id)
    );

    create table imagegallery (
        id int8 not null,
        tiledColumns int4,
        tiledWidth int4,
        tiledHeight int4,
        primary key (id)
    );

    create table imagepart (
        id int8 not null,
        primary key (id)
    );

    create table invitation (
        id int8 not null,
        code varchar(255),
        message varchar(255),
        state varchar(255),
        primary key (id)
    );

    create table item (
        id int8 not null,
        created timestamp,
        updated timestamp,
        primary key (id)
    );

    create table person (
        id int8 not null,
        givenName varchar(255),
        familyName varchar(255),
        additionalName varchar(255),
        namePrefix varchar(255),
        nameSuffix varchar(255),
        sex bool,
        primary key (id)
    );

    create table phonenumber (
        id int8 not null,
        number varchar(255),
        context varchar(255),
        primary key (id)
    );

    create table privilege (
        id int8 not null,
        object int8,
        subject int8,
        delete bool,
        view bool,
        alter bool,
        reference bool,
        primary key (id)
    );

    create table property (
        id int8 not null,
        key varchar(255),
        value varchar(4000),
        enity_id int8,
        sortorder int4,
        primary key (id)
    );

    create table relation (
        id int8 not null,
        kind varchar(255),
        position float4,
        super_entity_id int8 not null,
        sub_entity_id int8 not null,
        primary key (id)
    );

    create table topic (
        id int8 not null,
        primary key (id)
    );

    create table webnode (
        id int8 not null,
        primary key (id)
    );

    create table webpage (
        id int8 not null,
        title varchar(255),
        primary key (id)
    );

    create table website (
        id int8 not null,
        primary key (id)
    );

    create table webstructure (
        id int8 not null,
        primary key (id)
    );

    alter table "user" 
        add constraint FK36EBCBE94A3D71 
        foreign key (id) 
        references entity;

    alter table application 
        add constraint FK5CA40550E94A3D71 
        foreign key (id) 
        references entity;

    alter table compounddocument 
        add constraint FK2E80BFC6E94A3D71 
        foreign key (id) 
        references entity;

    alter table emailaddress 
        add constraint FK5CF248D8E94A3D71 
        foreign key (id) 
        references entity;

    alter table entity 
        add constraint FKB29DE3E3165C5561 
        foreign key (id) 
        references item;

    alter table event 
        add constraint FK5C6729AE94A3D71 
        foreign key (id) 
        references entity;

    alter table headerpart 
        add constraint FK75EB3800E94A3D71 
        foreign key (id) 
        references entity;

    alter table htmlpart 
        add constraint FKEBF39E1EE94A3D71 
        foreign key (id) 
        references entity;

    alter table image 
        add constraint FK5FAA95BE94A3D71 
        foreign key (id) 
        references entity;

    alter table imagegallery 
        add constraint FKB4BCA197E94A3D71 
        foreign key (id) 
        references entity;

    alter table imagepart 
        add constraint FKCBB4E7CEE94A3D71 
        foreign key (id) 
        references entity;

    alter table invitation 
        add constraint FK473F7799E94A3D71 
        foreign key (id) 
        references entity;

    alter table person 
        add constraint FKC4E39B55E94A3D71 
        foreign key (id) 
        references entity;

    alter table phonenumber 
        add constraint FKEF7FCE37E94A3D71 
        foreign key (id) 
        references entity;

    alter table property 
        add constraint FKC4CDDDD559D64C8B 
        foreign key (enity_id) 
        references entity;

    alter table relation 
        add constraint FKDEF3F9FCAC959B89 
        foreign key (super_entity_id) 
        references entity;

    alter table relation 
        add constraint FKDEF3F9FCCFFF80E 
        foreign key (sub_entity_id) 
        references entity;

    alter table relation 
        add constraint FKDEF3F9FC165C5561 
        foreign key (id) 
        references item;

    alter table topic 
        add constraint FK696CD2FE94A3D71 
        foreign key (id) 
        references entity;

    alter table webnode 
        add constraint FK48F7AF56E94A3D71 
        foreign key (id) 
        references entity;

    alter table webpage 
        add constraint FK48F863E3E94A3D71 
        foreign key (id) 
        references entity;

    alter table website 
        add constraint FK48F9E09BE94A3D71 
        foreign key (id) 
        references entity;

    alter table webstructure 
        add constraint FKDE88E09FE94A3D71 
        foreign key (id) 
        references entity;

    create sequence item_id_sequence;

    create sequence privilege_id_sequence;

    create sequence property_id_sequence;
