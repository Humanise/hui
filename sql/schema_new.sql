--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: address; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE address (
    id bigint NOT NULL,
    street character varying(255),
    city character varying(255),
    region character varying(255),
    country character varying(255),
    postalcode character varying(255)
);


ALTER TABLE public.address OWNER TO postgres;

--
-- Name: application; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE application (
    id bigint NOT NULL
);


ALTER TABLE public.application OWNER TO postgres;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE comment (
    id bigint NOT NULL,
    text character varying(4000)
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: compounddocument; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE compounddocument (
    id bigint NOT NULL,
    structure character varying(4000)
);


ALTER TABLE public.compounddocument OWNER TO postgres;

--
-- Name: emailaddress; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE emailaddress (
    id bigint NOT NULL,
    address character varying(255),
    context character varying(255)
);


ALTER TABLE public.emailaddress OWNER TO postgres;

--
-- Name: entity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE entity (
    id bigint NOT NULL,
    name character varying(255)
);


ALTER TABLE public.entity OWNER TO postgres;

--
-- Name: event; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event (
    id bigint NOT NULL,
    starttime timestamp without time zone,
    endtime timestamp without time zone,
    location character varying(255)
);


ALTER TABLE public.event OWNER TO postgres;

--
-- Name: headerpart; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE headerpart (
    id bigint NOT NULL,
    text character varying(255)
);


ALTER TABLE public.headerpart OWNER TO postgres;

--
-- Name: htmlpart; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE htmlpart (
    id bigint NOT NULL,
    html character varying(4000)
);


ALTER TABLE public.htmlpart OWNER TO postgres;

--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE image (
    id bigint NOT NULL,
    filesize bigint,
    contenttype character varying(255),
    width integer,
    height integer
);


ALTER TABLE public.image OWNER TO postgres;

--
-- Name: imagegallery; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE imagegallery (
    id bigint NOT NULL,
    tiledcolumns integer,
    tiledwidth integer,
    tiledheight integer
);


ALTER TABLE public.imagegallery OWNER TO postgres;

--
-- Name: imagepart; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE imagepart (
    id bigint NOT NULL
);


ALTER TABLE public.imagepart OWNER TO postgres;

--
-- Name: internetaddress; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE internetaddress (
    id bigint NOT NULL,
    address character varying(255),
    context character varying(255)
);


ALTER TABLE public.internetaddress OWNER TO postgres;

--
-- Name: invitation; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE invitation (
    id bigint NOT NULL,
    code character varying(255),
    message character varying(255),
    state character varying(255)
);


ALTER TABLE public.invitation OWNER TO postgres;

--
-- Name: item; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE item (
    id bigint NOT NULL,
    created timestamp without time zone,
    updated timestamp without time zone
);


ALTER TABLE public.item OWNER TO postgres;

--
-- Name: item_id_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE item_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.item_id_sequence OWNER TO postgres;

--
-- Name: language; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE language (
    id bigint NOT NULL,
    code character varying(255)
);


ALTER TABLE public.language OWNER TO postgres;

--
-- Name: lexicalcategory; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE lexicalcategory (
    id bigint NOT NULL,
    code character varying(255)
);


ALTER TABLE public.lexicalcategory OWNER TO postgres;

--
-- Name: location; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE location (
    id bigint NOT NULL,
    latitude double precision,
    longitude double precision,
    altitude double precision
);


ALTER TABLE public.location OWNER TO postgres;

--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE person (
    id bigint NOT NULL,
    givenname character varying(255),
    familyname character varying(255),
    additionalname character varying(255),
    nameprefix character varying(255),
    namesuffix character varying(255),
    sex boolean,
    birthday timestamp without time zone
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: phonenumber; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE phonenumber (
    id bigint NOT NULL,
    number character varying(255),
    context character varying(255)
);


ALTER TABLE public.phonenumber OWNER TO postgres;

--
-- Name: pile; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE pile (
    id bigint NOT NULL
);


ALTER TABLE public.pile OWNER TO postgres;

--
-- Name: privilege; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE privilege (
    id bigint NOT NULL,
    object bigint,
    subject bigint,
    delete boolean,
    view boolean,
    alter boolean,
    reference boolean
);


ALTER TABLE public.privilege OWNER TO postgres;

--
-- Name: privilege_id_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE privilege_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.privilege_id_sequence OWNER TO postgres;

--
-- Name: property; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE property (
    id bigint NOT NULL,
    key character varying(255),
    value character varying(100000),
    enity_id bigint,
    sortorder integer,
    doublevalue double precision,
    datevalue timestamp without time zone
);


ALTER TABLE public.property OWNER TO postgres;

--
-- Name: property_id_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE property_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.property_id_sequence OWNER TO postgres;

--
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE rating (
    id bigint NOT NULL,
    rating double precision
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- Name: relation; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE relation (
    id bigint NOT NULL,
    kind character varying(255),
    "position" real,
    super_entity_id bigint NOT NULL,
    sub_entity_id bigint NOT NULL
);


ALTER TABLE public.relation OWNER TO postgres;

--
-- Name: remoteaccount; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE remoteaccount (
    id bigint NOT NULL,
    username character varying(255),
    domain character varying(255)
);


ALTER TABLE public.remoteaccount OWNER TO postgres;

--
-- Name: topic; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE topic (
    id bigint NOT NULL
);


ALTER TABLE public.topic OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    id bigint NOT NULL,
    username character varying(255),
    password character varying(255),
    salt character varying(255)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: video; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE video (
    id bigint NOT NULL,
    filesize bigint,
    contenttype character varying(255),
    width integer,
    height integer
);


ALTER TABLE public.video OWNER TO postgres;

--
-- Name: vote; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vote (
    id bigint NOT NULL
);


ALTER TABLE public.vote OWNER TO postgres;

--
-- Name: webnode; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE webnode (
    id bigint NOT NULL
);


ALTER TABLE public.webnode OWNER TO postgres;

--
-- Name: webpage; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE webpage (
    id bigint NOT NULL,
    title character varying(255)
);


ALTER TABLE public.webpage OWNER TO postgres;

--
-- Name: website; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE website (
    id bigint NOT NULL
);


ALTER TABLE public.website OWNER TO postgres;

--
-- Name: webstructure; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE webstructure (
    id bigint NOT NULL
);


ALTER TABLE public.webstructure OWNER TO postgres;

--
-- Name: word; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE word (
    id bigint NOT NULL,
    text character varying(255)
);


ALTER TABLE public.word OWNER TO postgres;

--
-- Name: address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY application
    ADD CONSTRAINT application_pkey PRIMARY KEY (id);


--
-- Name: comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: compounddocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY compounddocument
    ADD CONSTRAINT compounddocument_pkey PRIMARY KEY (id);


--
-- Name: emailaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emailaddress
    ADD CONSTRAINT emailaddress_pkey PRIMARY KEY (id);


--
-- Name: entity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY entity
    ADD CONSTRAINT entity_pkey PRIMARY KEY (id);


--
-- Name: event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: headerpart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY headerpart
    ADD CONSTRAINT headerpart_pkey PRIMARY KEY (id);


--
-- Name: htmlpart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY htmlpart
    ADD CONSTRAINT htmlpart_pkey PRIMARY KEY (id);


--
-- Name: image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: imagegallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY imagegallery
    ADD CONSTRAINT imagegallery_pkey PRIMARY KEY (id);


--
-- Name: imagepart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY imagepart
    ADD CONSTRAINT imagepart_pkey PRIMARY KEY (id);


--
-- Name: internetaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY internetaddress
    ADD CONSTRAINT internetaddress_pkey PRIMARY KEY (id);


--
-- Name: invitation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY invitation
    ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);


--
-- Name: item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: language_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY language
    ADD CONSTRAINT language_pkey PRIMARY KEY (id);


--
-- Name: lexicalcategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY lexicalcategory
    ADD CONSTRAINT lexicalcategory_pkey PRIMARY KEY (id);


--
-- Name: location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: phonenumber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phonenumber
    ADD CONSTRAINT phonenumber_pkey PRIMARY KEY (id);


--
-- Name: pile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY pile
    ADD CONSTRAINT pile_pkey PRIMARY KEY (id);


--
-- Name: privilege_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY privilege
    ADD CONSTRAINT privilege_pkey PRIMARY KEY (id);


--
-- Name: property_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- Name: rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id);


--
-- Name: relation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY relation
    ADD CONSTRAINT relation_pkey PRIMARY KEY (id);


--
-- Name: remoteaccount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY remoteaccount
    ADD CONSTRAINT remoteaccount_pkey PRIMARY KEY (id);


--
-- Name: topic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);


--
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY video
    ADD CONSTRAINT video_pkey PRIMARY KEY (id);


--
-- Name: vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vote
    ADD CONSTRAINT vote_pkey PRIMARY KEY (id);


--
-- Name: webnode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY webnode
    ADD CONSTRAINT webnode_pkey PRIMARY KEY (id);


--
-- Name: webpage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY webpage
    ADD CONSTRAINT webpage_pkey PRIMARY KEY (id);


--
-- Name: website_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);


--
-- Name: webstructure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY webstructure
    ADD CONSTRAINT webstructure_pkey PRIMARY KEY (id);


--
-- Name: word_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY word
    ADD CONSTRAINT word_pkey PRIMARY KEY (id);


--
-- Name: addess_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX addess_id_index ON address USING btree (id);


--
-- Name: application_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX application_id_index ON application USING btree (id);


--
-- Name: comment_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX comment_id_index ON comment USING btree (id);


--
-- Name: compounddocument_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX compounddocument_id_index ON compounddocument USING btree (id);


--
-- Name: emailaddress_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX emailaddress_id_index ON emailaddress USING btree (id);


--
-- Name: entity_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX entity_id_index ON entity USING btree (id);


--
-- Name: event_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_id_index ON event USING btree (id);


--
-- Name: headerpart_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX headerpart_id_index ON headerpart USING btree (id);


--
-- Name: htmlpart_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX htmlpart_id_index ON htmlpart USING btree (id);


--
-- Name: image_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX image_id_index ON image USING btree (id);


--
-- Name: imagegallery_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX imagegallery_id_index ON imagegallery USING btree (id);


--
-- Name: imagepart_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX imagepart_id_index ON imagepart USING btree (id);


--
-- Name: internetaddress_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX internetaddress_id_index ON internetaddress USING btree (id);


--
-- Name: invitation_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX invitation_id_index ON invitation USING btree (id);


--
-- Name: item_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX item_id_index ON item USING btree (id);


--
-- Name: location_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX location_id_index ON location USING btree (id);


--
-- Name: person_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX person_id_index ON person USING btree (id);


--
-- Name: phonenumber_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX phonenumber_id_index ON phonenumber USING btree (id);


--
-- Name: pile_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX pile_id_index ON pile USING btree (id);


--
-- Name: privilege_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX privilege_id_index ON privilege USING btree (id);


--
-- Name: privilege_object_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX privilege_object_index ON privilege USING btree (object);


--
-- Name: privilege_subject_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX privilege_subject_index ON privilege USING btree (subject);


--
-- Name: property_entity_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX property_entity_id_index ON property USING btree (enity_id);


--
-- Name: property_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX property_id_index ON property USING btree (id);


--
-- Name: property_key_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX property_key_index ON property USING btree (key);


--
-- Name: rating_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX rating_id_index ON rating USING btree (id);


--
-- Name: relation_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX relation_id_index ON relation USING btree (id);


--
-- Name: relation_kind_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX relation_kind_index ON relation USING btree (kind);


--
-- Name: relation_sub_entity_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX relation_sub_entity_id_index ON relation USING btree (sub_entity_id);


--
-- Name: relation_super_entity_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX relation_super_entity_id_index ON relation USING btree (super_entity_id);


--
-- Name: remoteaccount_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX remoteaccount_id_index ON remoteaccount USING btree (id);


--
-- Name: topic_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX topic_id_index ON topic USING btree (id);


--
-- Name: user_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX user_id_index ON "user" USING btree (id);


--
-- Name: video_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX video_id_index ON video USING btree (id);


--
-- Name: vote_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX vote_id_index ON vote USING btree (id);


--
-- Name: webnode_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX webnode_id_index ON webnode USING btree (id);


--
-- Name: webpage_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX webpage_id_index ON webpage USING btree (id);


--
-- Name: website_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX website_id_index ON website USING btree (id);


--
-- Name: webstructure_id_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX webstructure_id_index ON webstructure USING btree (id);


--
-- Name: word_text_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX word_text_idx ON word USING btree (text);


--
-- Name: word_text_lower_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX word_text_lower_idx ON word USING btree (lower((text)::text));


--
-- Name: fk2e80bfc6e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY compounddocument
    ADD CONSTRAINT fk2e80bfc6e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk348132e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY pile
    ADD CONSTRAINT fk348132e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk36ebcbe94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT fk36ebcbe94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk3752eae94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vote
    ADD CONSTRAINT fk3752eae94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk37c70ae94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY word
    ADD CONSTRAINT fk37c70ae94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk38a5ee5fe94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT fk38a5ee5fe94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk473f7799e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY invitation
    ADD CONSTRAINT fk473f7799e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk48f7af56e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY webnode
    ADD CONSTRAINT fk48f7af56e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk48f863e3e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY webpage
    ADD CONSTRAINT fk48f863e3e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk48f9e09be94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY website
    ADD CONSTRAINT fk48f9e09be94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk5c6729ae94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT fk5c6729ae94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk5ca40550e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY application
    ADD CONSTRAINT fk5ca40550e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk5cf248d8e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emailaddress
    ADD CONSTRAINT fk5cf248d8e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk5faa95be94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY image
    ADD CONSTRAINT fk5faa95be94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk696cd2fe94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY topic
    ADD CONSTRAINT fk696cd2fe94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk6b0147be94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY video
    ADD CONSTRAINT fk6b0147be94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk714f9fb5e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY location
    ADD CONSTRAINT fk714f9fb5e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk7553d727e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY remoteaccount
    ADD CONSTRAINT fk7553d727e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk75eb3800e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY headerpart
    ADD CONSTRAINT fk75eb3800e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk96c65993e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY internetaddress
    ADD CONSTRAINT fk96c65993e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fk9fd29358e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY language
    ADD CONSTRAINT fk9fd29358e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkae7fce62e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY lexicalcategory
    ADD CONSTRAINT fkae7fce62e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkb29de3e3165c5561; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entity
    ADD CONSTRAINT fkb29de3e3165c5561 FOREIGN KEY (id) REFERENCES item(id);


--
-- Name: fkb4bca197e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY imagegallery
    ADD CONSTRAINT fkb4bca197e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkbb979bf4e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY address
    ADD CONSTRAINT fkbb979bf4e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkc4cdddd559d64c8b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY property
    ADD CONSTRAINT fkc4cdddd559d64c8b FOREIGN KEY (enity_id) REFERENCES entity(id);


--
-- Name: fkc4e39b55e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY person
    ADD CONSTRAINT fkc4e39b55e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkc815b19de94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT fkc815b19de94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkcbb4e7cee94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY imagepart
    ADD CONSTRAINT fkcbb4e7cee94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkde88e09fe94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY webstructure
    ADD CONSTRAINT fkde88e09fe94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkdef3f9fc165c5561; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY relation
    ADD CONSTRAINT fkdef3f9fc165c5561 FOREIGN KEY (id) REFERENCES item(id);


--
-- Name: fkdef3f9fcac959b89; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY relation
    ADD CONSTRAINT fkdef3f9fcac959b89 FOREIGN KEY (super_entity_id) REFERENCES entity(id);


--
-- Name: fkdef3f9fccfff80e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY relation
    ADD CONSTRAINT fkdef3f9fccfff80e FOREIGN KEY (sub_entity_id) REFERENCES entity(id);


--
-- Name: fkebf39e1ee94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY htmlpart
    ADD CONSTRAINT fkebf39e1ee94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: fkef7fce37e94a3d71; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phonenumber
    ADD CONSTRAINT fkef7fce37e94a3d71 FOREIGN KEY (id) REFERENCES entity(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

