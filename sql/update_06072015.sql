create table hypothesis (id int8 not null, text varchar(10000), primary key (id));
create table statement (id int8 not null, text varchar(10000), primary key (id));
create table question (id int8 not null, text varchar(10000), primary key (id));

alter table hypothesis add constraint FK8061199CE94A3D71 foreign key (id) references entity;
alter table question add constraint FKBA823BE6E94A3D71 foreign key (id) references entity;
alter table statement add constraint FK83B7296FE94A3D71 foreign key (id) references entity;

