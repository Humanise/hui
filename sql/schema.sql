alter table "user" drop constraint FK36EBCBE94A3D71
alter table address drop constraint FKBB979BF4E94A3D71
alter table application drop constraint FK5CA40550E94A3D71
alter table comment drop constraint FK38A5EE5FE94A3D71
alter table compounddocument drop constraint FK2E80BFC6E94A3D71
alter table emailaddress drop constraint FK5CF248D8E94A3D71
alter table entity drop constraint FKB29DE3E3165C5561
alter table event drop constraint FK5C6729AE94A3D71
alter table headerpart drop constraint FK75EB3800E94A3D71
alter table htmlpart drop constraint FKEBF39E1EE94A3D71
alter table hypothesis drop constraint FK8061199CE94A3D71
alter table image drop constraint FK5FAA95BE94A3D71
alter table imagegallery drop constraint FKB4BCA197E94A3D71
alter table imagepart drop constraint FKCBB4E7CEE94A3D71
alter table internetaddress drop constraint FK96C65993E94A3D71
alter table invitation drop constraint FK473F7799E94A3D71
alter table language drop constraint FK9FD29358E94A3D71
alter table lexicalcategory drop constraint FKAE7FCE62E94A3D71
alter table location drop constraint FK714F9FB5E94A3D71
alter table person drop constraint FKC4E39B55E94A3D71
alter table phonenumber drop constraint FKEF7FCE37E94A3D71
alter table pile drop constraint FK348132E94A3D71
alter table property drop constraint FKC4CDDDD559D64C8B
alter table question drop constraint FKBA823BE6E94A3D71
alter table rating drop constraint FKC815B19DE94A3D71
alter table relation drop constraint FKDEF3F9FCAC959B89
alter table relation drop constraint FKDEF3F9FC165C5561
alter table relation drop constraint FKDEF3F9FCCFFF80E
alter table remoteaccount drop constraint FK7553D727E94A3D71
alter table statement drop constraint FK83B7296FE94A3D71
alter table topic drop constraint FK696CD2FE94A3D71
alter table video drop constraint FK6B0147BE94A3D71
alter table vote drop constraint FK3752EAE94A3D71
alter table webnode drop constraint FK48F7AF56E94A3D71
alter table webpage drop constraint FK48F863E3E94A3D71
alter table website drop constraint FK48F9E09BE94A3D71
alter table webstructure drop constraint FKDE88E09FE94A3D71
alter table word drop constraint FK37C70AE94A3D71
drop table "user" cascade
drop table address cascade
drop table application cascade
drop table comment cascade
drop table compounddocument cascade
drop table emailaddress cascade
drop table entity cascade
drop table event cascade
drop table headerpart cascade
drop table htmlpart cascade
drop table hypothesis cascade
drop table image cascade
drop table imagegallery cascade
drop table imagepart cascade
drop table internetaddress cascade
drop table invitation cascade
drop table item cascade
drop table language cascade
drop table lexicalcategory cascade
drop table location cascade
drop table person cascade
drop table phonenumber cascade
drop table pile cascade
drop table privilege cascade
drop table property cascade
drop table question cascade
drop table rating cascade
drop table relation cascade
drop table remoteaccount cascade
drop table statement cascade
drop table topic cascade
drop table video cascade
drop table vote cascade
drop table webnode cascade
drop table webpage cascade
drop table website cascade
drop table webstructure cascade
drop table word cascade
drop sequence item_id_sequence
drop sequence privilege_id_sequence
drop sequence property_id_sequence
create table "user" (id int8 not null, username varchar(255), password varchar(255), salt varchar(255), primary key (id))
create table address (id int8 not null, street varchar(255), city varchar(255), region varchar(255), country varchar(255), postalCode varchar(255), primary key (id))
create table application (id int8 not null, primary key (id))
create table comment (id int8 not null, text varchar(4000), primary key (id))
create table compounddocument (id int8 not null, structure varchar(4000), primary key (id))
create table emailaddress (id int8 not null, address varchar(255), context varchar(255), primary key (id))
create table entity (id int8 not null, name varchar(255), primary key (id))
create table event (id int8 not null, startTime timestamp, endTime timestamp, location varchar(255), primary key (id))
create table headerpart (id int8 not null, text varchar(4000), primary key (id))
create table htmlpart (id int8 not null, html varchar(4000), primary key (id))
create table hypothesis (id int8 not null, text varchar(10000), primary key (id))
create table image (id int8 not null, fileSize int8, contentType varchar(255), width int4, height int4, primary key (id))
create table imagegallery (id int8 not null, tiledColumns int4, tiledWidth int4, tiledHeight int4, primary key (id))
create table imagepart (id int8 not null, primary key (id))
create table internetaddress (id int8 not null, address varchar(255), context varchar(255), primary key (id))
create table invitation (id int8 not null, code varchar(255), message varchar(255), state varchar(255), primary key (id))
create table item (id int8 not null, created timestamp, updated timestamp, primary key (id))
create table language (id int8 not null, code varchar(255), primary key (id))
create table lexicalcategory (id int8 not null, code varchar(255), primary key (id))
create table location (id int8 not null, latitude float8, longitude float8, altitude float8, primary key (id))
create table person (id int8 not null, givenName varchar(255), familyName varchar(255), additionalName varchar(255), namePrefix varchar(255), nameSuffix varchar(255), sex bool, birthday timestamp, primary key (id))
create table phonenumber (id int8 not null, number varchar(255), context varchar(255), primary key (id))
create table pile (id int8 not null, primary key (id))
create table privilege (id int8 not null, object int8, subject int8, delete bool, view bool, alter bool, reference bool, primary key (id))
create table property (id int8 not null, key varchar(255), value varchar(4000), doubleValue float8, dateValue timestamp, entity_id int8, sortorder int4, primary key (id))
create table question (id int8 not null, text varchar(10000), primary key (id))
create table rating (id int8 not null, rating float8, primary key (id))
create table relation (id int8 not null, kind varchar(255), position float4, strength float8, super_entity_id int8 not null, sub_entity_id int8 not null, primary key (id))
create table remoteaccount (id int8 not null, username varchar(255), domain varchar(255), primary key (id))
create table statement (id int8 not null, text varchar(10000), primary key (id))
create table topic (id int8 not null, primary key (id))
create table video (id int8 not null, fileSize int8, contentType varchar(255), width int4, height int4, primary key (id))
create table vote (id int8 not null, primary key (id))
create table webnode (id int8 not null, primary key (id))
create table webpage (id int8 not null, title varchar(255), primary key (id))
create table website (id int8 not null, primary key (id))
create table webstructure (id int8 not null, primary key (id))
create table word (id int8 not null, text varchar(255), primary key (id))
alter table "user" add constraint FK36EBCBE94A3D71 foreign key (id) references entity
alter table address add constraint FKBB979BF4E94A3D71 foreign key (id) references entity
alter table application add constraint FK5CA40550E94A3D71 foreign key (id) references entity
alter table comment add constraint FK38A5EE5FE94A3D71 foreign key (id) references entity
alter table compounddocument add constraint FK2E80BFC6E94A3D71 foreign key (id) references entity
alter table emailaddress add constraint FK5CF248D8E94A3D71 foreign key (id) references entity
alter table entity add constraint FKB29DE3E3165C5561 foreign key (id) references item
alter table event add constraint FK5C6729AE94A3D71 foreign key (id) references entity
alter table headerpart add constraint FK75EB3800E94A3D71 foreign key (id) references entity
alter table htmlpart add constraint FKEBF39E1EE94A3D71 foreign key (id) references entity
alter table hypothesis add constraint FK8061199CE94A3D71 foreign key (id) references entity
alter table image add constraint FK5FAA95BE94A3D71 foreign key (id) references entity
alter table imagegallery add constraint FKB4BCA197E94A3D71 foreign key (id) references entity
alter table imagepart add constraint FKCBB4E7CEE94A3D71 foreign key (id) references entity
alter table internetaddress add constraint FK96C65993E94A3D71 foreign key (id) references entity
alter table invitation add constraint FK473F7799E94A3D71 foreign key (id) references entity
alter table language add constraint FK9FD29358E94A3D71 foreign key (id) references entity
alter table lexicalcategory add constraint FKAE7FCE62E94A3D71 foreign key (id) references entity
alter table location add constraint FK714F9FB5E94A3D71 foreign key (id) references entity
alter table person add constraint FKC4E39B55E94A3D71 foreign key (id) references entity
alter table phonenumber add constraint FKEF7FCE37E94A3D71 foreign key (id) references entity
alter table pile add constraint FK348132E94A3D71 foreign key (id) references entity
alter table property add constraint FKC4CDDDD559D64C8B foreign key (entity_id) references entity
alter table question add constraint FKBA823BE6E94A3D71 foreign key (id) references entity
alter table rating add constraint FKC815B19DE94A3D71 foreign key (id) references entity
alter table relation add constraint FKDEF3F9FCAC959B89 foreign key (super_entity_id) references entity
alter table relation add constraint FKDEF3F9FC165C5561 foreign key (id) references item
alter table relation add constraint FKDEF3F9FCCFFF80E foreign key (sub_entity_id) references entity
alter table remoteaccount add constraint FK7553D727E94A3D71 foreign key (id) references entity
alter table statement add constraint FK83B7296FE94A3D71 foreign key (id) references entity
alter table topic add constraint FK696CD2FE94A3D71 foreign key (id) references entity
alter table video add constraint FK6B0147BE94A3D71 foreign key (id) references entity
alter table vote add constraint FK3752EAE94A3D71 foreign key (id) references entity
alter table webnode add constraint FK48F7AF56E94A3D71 foreign key (id) references entity
alter table webpage add constraint FK48F863E3E94A3D71 foreign key (id) references entity
alter table website add constraint FK48F9E09BE94A3D71 foreign key (id) references entity
alter table webstructure add constraint FKDE88E09FE94A3D71 foreign key (id) references entity
alter table word add constraint FK37C70AE94A3D71 foreign key (id) references entity
create sequence item_id_sequence
create sequence privilege_id_sequence
create sequence property_id_sequence
