create table application (
    id int8 not null,
    primary key (id)
);

alter table application 
    add constraint FK5CA40550E94A3D71 
    foreign key (id) 
    references entity;