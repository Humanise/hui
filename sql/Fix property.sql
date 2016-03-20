ALTER TABLE property ADD COLUMN "entity_id" bigint;

UPDATE property SET entity_id = enity_id;

ALTER TABLE property ADD CONSTRAINT "fk_property_entity" FOREIGN KEY ("entity_id") REFERENCES entity("id");

ALTER TABLE property DROP COLUMN "enity_id";