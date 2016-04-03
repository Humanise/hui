-- Materialized View: public.word_list_view

-- DROP MATERIALIZED VIEW public.word_list_view;

CREATE MATERIALIZED VIEW public.word_list_view AS 
 SELECT DISTINCT word.id,
    word.text,
    lower(word.text::text) AS text_lower,
        CASE
            WHEN "substring"(lower(word.text::text), 1, 1) = ANY (ARRAY['a'::text, 'b'::text, 'c'::text, 'd'::text, 'e'::text, 'f'::text, 'g'::text, 'h'::text, 'i'::text, 'j'::text, 'k'::text, 'l'::text, 'm'::text, 'n'::text, 'o'::text, 'p'::text, 'q'::text, 'r'::text, 's'::text, 't'::text, 'u'::text, 'v'::text, 'w'::text, 'x'::text, 'y'::text, 'z'::text, 'æ'::text, 'ø'::text, 'å'::text]) THEN "substring"(lower(word.text::text), 1, 1)
            WHEN "substring"(lower(word.text::text), 1, 1) = ANY (ARRAY['é'::text, 'ë'::text]) THEN 'e'::text
            WHEN "substring"(lower(word.text::text), 1, 1) = 'ä'::text THEN 'æ'::text
            WHEN "substring"(lower(word.text::text), 1, 1) = 'á'::text THEN 'a'::text
            WHEN "substring"(lower(word.text::text), 1, 1) = ANY (ARRAY['ó'::text, 'ö'::text]) THEN 'a'::text
            WHEN "substring"(lower(word.text::text), 1, 1) = ANY (ARRAY['0'::text, '1'::text, '2'::text, '3'::text, '4'::text, '5'::text, '6'::text, '7'::text, '8'::text, '9'::text]) THEN '#'::text
            ELSE '?'::text
        END AS letter,
    language.code AS language,
    lexicalcategory.code AS category,
    item.created,
    property.value AS glossary,
    word_source.sub_entity_id AS source
   FROM word
     LEFT JOIN item ON item.id = word.id
     LEFT JOIN relation word_language ON word_language.sub_entity_id = word.id AND (word_language.super_entity_id IN ( SELECT language_1.id
           FROM language language_1))
     LEFT JOIN language ON word_language.super_entity_id = language.id
     LEFT JOIN relation word_category ON word_category.sub_entity_id = word.id AND (word_category.super_entity_id IN ( SELECT lexicalcategory_1.id
           FROM lexicalcategory lexicalcategory_1))
     LEFT JOIN relation word_source ON word_source.super_entity_id = word.id AND word_source.kind::text = 'common.source'::text
     LEFT JOIN lexicalcategory ON word_category.super_entity_id = lexicalcategory.id
     LEFT JOIN property ON word.id = property.entity_id AND property.key::text = 'semantics.glossary'::text
     
order by text_lower
WITH DATA;

ALTER TABLE public.word_list_view
  OWNER TO postgres;

-- Index: public.word_list_view_id_index

-- DROP INDEX public.word_list_view_id_index;

CREATE INDEX word_list_view_id_index
  ON public.word_list_view
  USING btree
  (id);

-- Index: public.word_list_view_text_index

-- DROP INDEX public.word_list_view_text_index;

CREATE INDEX word_list_view_text_index
  ON public.word_list_view
  USING btree
  (text_lower COLLATE pg_catalog."default");

