

    create table internetaddress (
        id int8 not null,
        address varchar(255),
        context varchar(255),
        primary key (id)
    );

    alter table internetaddress 
        add constraint FK96C65993E94A3D71 
        foreign key (id) 
        references entity;