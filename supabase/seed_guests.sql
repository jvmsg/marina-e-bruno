-- Seed guests from "Lista de Convidados-.pdf"
-- Generated 2026-07-26
-- Families: 62
-- Guests: 128
--
-- Phone format: 55 + DDD + number (digits only), empty string when unknown.
-- Lookup works when a family member with a phone confirms presence.
--
-- Review warnings before running:
-- - Family note under #16 (not inserted as guest): A gordinha não conta kkkk
-- - Family note under #18 (not inserted as guest): Maite não conta kkk
-- - Family note under #23 (not inserted as guest): Otto é menor 7 anos
-- - Skipped #24: Perguntar sobre a Júlia
-- - Family note under #42 (not inserted as guest): O Bernardo é menor de 7 anos
-- - Family note under #52 (not inserted as guest): Lucca neném
-- - Added companion from note under #90: Gustavo
-- - Skipped #106: Filha da esposa —
-- - Skipped #130: 
-- - #5 Maria da Conceição phone from PDF looks short (8 digits after DDD 89): verify 558999256205
-- - Last family group (#124–129) may need manual split if they are not one household

begin;

-- Optional: clear existing invite list first (uncomment if re-seeding)
-- delete from public.guests;
-- delete from public.families;

-- Family: Elieth & Inácio
with inserted as (
  insert into public.families (display_name)
  values ('Elieth & Inácio')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Elieth', '', '5512981263518', 'female'), -- #1 Elieth
    ('Inácio', '', '5512991614316', 'male') -- #2 Inácio
) as g(first_name, last_name, phone, gender);

-- Family: Marília & João
with inserted as (
  insert into public.families (display_name)
  values ('Marília & João')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Marília', 'Alencar', '5512982534607', 'female'), -- #3 Marília Alencar
    ('João Victor', 'Gomes', '5512982265697', 'male') -- #4 João Victor Gomes
) as g(first_name, last_name, phone, gender);

-- Family: Maria & Joaquim
with inserted as (
  insert into public.families (display_name)
  values ('Maria & Joaquim')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Maria', 'da Conceição', '558999256205', 'female'), -- #5 Maria da Conceição
    ('Joaquim Pereira', 'Leal', '', 'male') -- #6 Joaquim Pereira Leal
) as g(first_name, last_name, phone, gender);

-- Family: Inácio & Maria
with inserted as (
  insert into public.families (display_name)
  values ('Inácio & Maria')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Inácio', 'Ibiapina', '5512991171995', 'male'), -- #7 Inácio Ibiapina
    ('Maria Angelina', 'Alencar', '5512981261971', 'female') -- #8 Maria Angelina Alencar
) as g(first_name, last_name, phone, gender);

-- Family: Aurea & Pedro
with inserted as (
  insert into public.families (display_name)
  values ('Aurea & Pedro')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Aurea Maria', 'Venancio', '5512988562104', 'female'), -- #9 Aurea Maria Venancio
    ('Pedro', 'Pereira', '5512997309039', 'male') -- #10 Pedro Pereira
) as g(first_name, last_name, phone, gender);

-- Family: Bernadete
with inserted as (
  insert into public.families (display_name)
  values ('Bernadete')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Bernadete', 'Venancio', '5512991702063', 'female') -- #11 Bernadete Venancio
) as g(first_name, last_name, phone, gender);

-- Family: Dione & Marcos
with inserted as (
  insert into public.families (display_name)
  values ('Dione & Marcos')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Dione', 'Rufino', '5512991748178', 'female'), -- #12 Dione Rufino
    ('Marcos Benedito', 'Correa', '5512991879647', 'male') -- #13 Marcos Benedito Correa
) as g(first_name, last_name, phone, gender);

-- Family: Pâmela & família
with inserted as (
  insert into public.families (display_name)
  values ('Pâmela & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Pâmela Regina', 'Rufino', '5512991783212', 'female'), -- #14 Pâmela Regina Rufino
    ('Marcos Vinicius', 'Rufino', '5512991516184', 'male'), -- #15 Marcos Vinicius Rufino
    ('Leonardo Augusto Correa', 'Rufino', '', 'male') -- #16 Leonardo Augusto Correa Rufino
) as g(first_name, last_name, phone, gender);

-- Family: Aline & Paulo
with inserted as (
  insert into public.families (display_name)
  values ('Aline & Paulo')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Aline Marcelle', 'Rufino', '5512991584856', 'female'), -- #17 Aline Marcelle Rufino
    ('Paulo', 'Júnior', '', 'male') -- #18 Paulo Júnior
) as g(first_name, last_name, phone, gender);

-- Family: Emily
with inserted as (
  insert into public.families (display_name)
  values ('Emily')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Emily', 'Naregi', '5512988730664', 'female') -- #19 Emily Naregi
) as g(first_name, last_name, phone, gender);

-- Family: Neiva & Alcides
with inserted as (
  insert into public.families (display_name)
  values ('Neiva & Alcides')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Neiva', 'Cabral', '5518996381708', 'female'), -- #20 Neiva Cabral
    ('Alcides', 'Tereza', '5518997781604', 'male') -- #21 Alcides Tereza
) as g(first_name, last_name, phone, gender);

-- Family: Silvia
with inserted as (
  insert into public.families (display_name)
  values ('Silvia')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Silvia Tereza', 'Cabral', '5519996766135', 'female') -- #22 Silvia Tereza Cabral
) as g(first_name, last_name, phone, gender);

-- Family: Renan
with inserted as (
  insert into public.families (display_name)
  values ('Renan')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Renan', '', '', 'male') -- #23 Renan
) as g(first_name, last_name, phone, gender);

-- Family: Djanira & Marcos
with inserted as (
  insert into public.families (display_name)
  values ('Djanira & Marcos')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Djanira', 'Mendonça', '5512997751329', 'female'), -- #25 Djanira Mendonça
    ('Marcos Vinicius', 'Mendonça', '', 'male') -- #26 Marcos Vinicius Mendonça
) as g(first_name, last_name, phone, gender);

-- Family: Ludmila & família
with inserted as (
  insert into public.families (display_name)
  values ('Ludmila & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Ludmila', 'Mendonça', '5512996217024', 'female'), -- #27 Ludmila Mendonça
    ('Thais', 'Mendonça', '5512991289229', 'female'), -- #28 Thais Mendonça
    ('Rodrigo', '', '', 'male') -- #29 Rodrigo
) as g(first_name, last_name, phone, gender);

-- Family: Maria & Giovanna
with inserted as (
  insert into public.families (display_name)
  values ('Maria & Giovanna')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Maria Ivete Mendes', 'Figueiredo', '5511983865999', 'female'), -- #30 Maria Ivete Mendes Figueiredo
    ('Giovanna', 'Mendes', '5511986535467', 'female') -- #31 Giovanna Mendes
) as g(first_name, last_name, phone, gender);

-- Family: Beatriz & Luiz
with inserted as (
  insert into public.families (display_name)
  values ('Beatriz & Luiz')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Beatriz', 'Mendes', '5511953729814', 'female'), -- #32 Beatriz Mendes
    ('Luiz Henrique', 'Fernandes', '5511991483136', 'male') -- #33 Luiz Henrique Fernandes
) as g(first_name, last_name, phone, gender);

-- Family: Keith & família
with inserted as (
  insert into public.families (display_name)
  values ('Keith & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Keith', 'Mendes', '5511983909898', 'female'), -- #34 Keith Mendes
    ('Alaor Simão', 'Junior', '5511981068678', 'male'), -- #35 Alaor Simão Junior
    ('Alice', 'Mendes', '', 'female') -- #36 Alice Mendes
) as g(first_name, last_name, phone, gender);

-- Family: Maria & família
with inserted as (
  insert into public.families (display_name)
  values ('Maria & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Maria Elisete', 'Mendes', '5511983289692', 'female'), -- #37 Maria Elisete Mendes
    ('Gilmar', 'de Oliveira', '5511996932378', 'male'), -- #38 Gilmar de Oliveira
    ('Lívia', 'Mendes', '5511981770388', 'female'), -- #39 Lívia Mendes
    ('Namorado', 'da Lívia', '', 'other') -- #40 Namorado da Lívia
) as g(first_name, last_name, phone, gender);

-- Family: Letícia & Gustavo
with inserted as (
  insert into public.families (display_name)
  values ('Letícia & Gustavo')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Letícia', 'Mendes', '5511964254456', 'female'), -- #41 Letícia Mendes
    ('Gustavo', 'Faria', '5511995478689', 'male') -- #42 Gustavo Faria
) as g(first_name, last_name, phone, gender);

-- Family: Benedito & Francisca
with inserted as (
  insert into public.families (display_name)
  values ('Benedito & Francisca')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Benedito Lourenço Alves', 'Filho', '5511954549968', 'male'), -- #43 Benedito Lourenço Alves Filho
    ('Francisca Gonçalves', 'Alves', '5511944914810', 'female') -- #44 Francisca Gonçalves Alves
) as g(first_name, last_name, phone, gender);

-- Family: Larielson & Weriks
with inserted as (
  insert into public.families (display_name)
  values ('Larielson & Weriks')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Larielson', 'Sirino', '5511987180855', 'male'), -- #45 Larielson Sirino
    ('Weriks', 'Ribeiro', '', 'male') -- #46 Weriks Ribeiro
) as g(first_name, last_name, phone, gender);

-- Family: Luiza
with inserted as (
  insert into public.families (display_name)
  values ('Luiza')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Luiza Inacilda', 'Alencar', '5512981949543', 'female') -- #47 Luiza Inacilda Alencar
) as g(first_name, last_name, phone, gender);

-- Family: Gabriela
with inserted as (
  insert into public.families (display_name)
  values ('Gabriela')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Gabriela', 'Borges', '5512991006112', 'female') -- #48 Gabriela Borges
) as g(first_name, last_name, phone, gender);

-- Family: Sabrina & Isabela
with inserted as (
  insert into public.families (display_name)
  values ('Sabrina & Isabela')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Sabrina', 'Alencar', '5512997588533', 'female'), -- #49 Sabrina Alencar
    ('Isabela', 'Makiyama', '', 'female') -- #50 Isabela Makiyama
) as g(first_name, last_name, phone, gender);

-- Family: Anna & Claudinei
with inserted as (
  insert into public.families (display_name)
  values ('Anna & Claudinei')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Anna', 'Clara', '5512992361369', 'female'), -- #51 Anna Clara
    ('Claudinei', '', '', 'male') -- #52 Claudinei
) as g(first_name, last_name, phone, gender);

-- Family: Dayane & Lucas
with inserted as (
  insert into public.families (display_name)
  values ('Dayane & Lucas')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Dayane Cristina Moreira', 'Inácio', '5512991989740', 'female'), -- #53 Dayane Cristina Moreira Inácio
    ('Lucas Gabriel', 'Inácio', '', 'male') -- #54 Lucas Gabriel Inácio
) as g(first_name, last_name, phone, gender);

-- Family: Isabel & Renan
with inserted as (
  insert into public.families (display_name)
  values ('Isabel & Renan')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Isabel', 'Franciele', '5512996041050', 'female'), -- #55 Isabel Franciele
    ('Renan', 'Munari', '5512997092828', 'male') -- #56 Renan Munari
) as g(first_name, last_name, phone, gender);

-- Family: Debora & Victor
with inserted as (
  insert into public.families (display_name)
  values ('Debora & Victor')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Debora Cristina', 'Silva', '5512988799311', 'female'), -- #57 Debora Cristina Silva
    ('Victor Duarte', 'Leite', '', 'male') -- #58 Victor Duarte Leite
) as g(first_name, last_name, phone, gender);

-- Family: Tania
with inserted as (
  insert into public.families (display_name)
  values ('Tania')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Tania', '', '5512991393086', 'female') -- #59 Tania
) as g(first_name, last_name, phone, gender);

-- Family: Stephany & Carlos
with inserted as (
  insert into public.families (display_name)
  values ('Stephany & Carlos')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Stephany Ferreira', 'David', '5512982646670', 'female'), -- #60 Stephany Ferreira David
    ('Carlos Francisco', 'Santíssimo', '', 'male') -- #61 Carlos Francisco Santíssimo
) as g(first_name, last_name, phone, gender);

-- Family: Francisco & família
with inserted as (
  insert into public.families (display_name)
  values ('Francisco & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Francisco', 'José', '5511972732323', 'male'), -- #62 Francisco José
    ('Felipe', 'Serafim', '', 'male'), -- #63 Felipe Serafim
    ('Lara', '', '', 'female') -- #64 Lara
) as g(first_name, last_name, phone, gender);

-- Family: Zezinho
with inserted as (
  insert into public.families (display_name)
  values ('Zezinho')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Zezinho', '', '', 'male') -- #65 Zezinho
) as g(first_name, last_name, phone, gender);

-- Family: Francisco
with inserted as (
  insert into public.families (display_name)
  values ('Francisco')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Francisco', 'das Chagas', '5512981468050', 'male') -- #66 Francisco das Chagas
) as g(first_name, last_name, phone, gender);

-- Family: Maria
with inserted as (
  insert into public.families (display_name)
  values ('Maria')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Maria Lucinda', 'Alencar', '5512997468320', 'female') -- #67 Maria Lucinda Alencar
) as g(first_name, last_name, phone, gender);

-- Family: Fátima & família
with inserted as (
  insert into public.families (display_name)
  values ('Fátima & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Fátima Aparecida', 'Silva', '5512982917889', 'female'), -- #68 Fátima Aparecida Silva
    ('Nivaldo Aparecido', 'de Oliveira', '5512991677574', 'male'), -- #69 Nivaldo Aparecido de Oliveira
    ('Pablo', '', '', 'male') -- #70 Pablo
) as g(first_name, last_name, phone, gender);

-- Family: Fabiana & família
with inserted as (
  insert into public.families (display_name)
  values ('Fabiana & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Fabiana', 'Joelma', '5512991111614', 'female'), -- #71 Fabiana Joelma
    ('Adriano', '', '', 'male'), -- #72 Adriano
    ('Juan', '', '', 'male') -- #73 Juan
) as g(first_name, last_name, phone, gender);

-- Family: Fátima & Benedito
with inserted as (
  insert into public.families (display_name)
  values ('Fátima & Benedito')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Fátima Regina', 'da Silva', '', 'female'), -- #74 Fátima Regina da Silva
    ('Benedito Carlos', 'da Silva', '', 'male') -- #75 Benedito Carlos da Silva
) as g(first_name, last_name, phone, gender);

-- Family: Carla & Renan
with inserted as (
  insert into public.families (display_name)
  values ('Carla & Renan')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Carla', 'Chaiene', '5512992114244', 'female'), -- #76 Carla Chaiene
    ('Renan', '', '', 'male') -- #77 Renan
) as g(first_name, last_name, phone, gender);

-- Family: Karla
with inserted as (
  insert into public.families (display_name)
  values ('Karla')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Karla Roberta da Silva', 'Marcos', '5512991290457', 'female') -- #78 Karla Roberta da Silva Marcos
) as g(first_name, last_name, phone, gender);

-- Family: Renata & família
with inserted as (
  insert into public.families (display_name)
  values ('Renata & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Renata', 'Moreira', '5512991651132', 'female'), -- #79 Renata Moreira
    ('Claudio', '', '', 'male'), -- #80 Claudio
    ('Alex', '', '', 'male'), -- #81 Alex
    ('Pamela', '', '', 'female') -- #82 Pamela
) as g(first_name, last_name, phone, gender);

-- Family: Vantilde & família
with inserted as (
  insert into public.families (display_name)
  values ('Vantilde & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Vantilde (Tico)', '', '5512991184048', 'other'), -- #83 Vantilde (Tico)
    ('Mayara', '', '', 'female'), -- #84 Mayara
    ('Matheus', '', '', 'male'), -- #85 Matheus
    ('Enzo', '', '', 'male') -- #86 Enzo
) as g(first_name, last_name, phone, gender);

-- Family: Fio & família
with inserted as (
  insert into public.families (display_name)
  values ('Fio & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Fio', '', '5512991627360', 'male'), -- #87 Fio
    ('Bruna', 'Evelyn', '', 'female'), -- #88 Bruna Evelyn
    ('Lara', '', '', 'female'), -- #89 Lara
    ('Larissa', 'Vasconcellos', '5512992291040', 'female'), -- #90 Larissa Vasconcellos
    ('Gustavo', '', '', 'male') -- #90 (+note) Gustavo
) as g(first_name, last_name, phone, gender);

-- Family: Lucia
with inserted as (
  insert into public.families (display_name)
  values ('Lucia')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Lucia Ines', 'da Silva', '', 'female') -- #91 Lucia Ines da Silva
) as g(first_name, last_name, phone, gender);

-- Family: Carlos & Ingrid
with inserted as (
  insert into public.families (display_name)
  values ('Carlos & Ingrid')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Carlos', 'Henrique', '5512996151403', 'male'), -- #92 Carlos Henrique
    ('Ingrid', '', '', 'female') -- #93 Ingrid
) as g(first_name, last_name, phone, gender);

-- Family: Maria
with inserted as (
  insert into public.families (display_name)
  values ('Maria')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Maria', '', '', 'female') -- #94 Maria
) as g(first_name, last_name, phone, gender);

-- Family: Felipe & Renata
with inserted as (
  insert into public.families (display_name)
  values ('Felipe & Renata')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Felipe', 'Caetano', '5512997941712', 'male'), -- #95 Felipe Caetano
    ('Renata', '', '', 'female') -- #96 Renata
) as g(first_name, last_name, phone, gender);

-- Family: Ricardo
with inserted as (
  insert into public.families (display_name)
  values ('Ricardo')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Ricardo', '', '5512988286072', 'male') -- #97 Ricardo
) as g(first_name, last_name, phone, gender);

-- Family: Alex & Aline
with inserted as (
  insert into public.families (display_name)
  values ('Alex & Aline')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Alex', '', '5512991005986', 'male'), -- #98 Alex
    ('Aline', '', '5512992194997', 'female') -- #99 Aline
) as g(first_name, last_name, phone, gender);

-- Family: Isabel & Fabiano
with inserted as (
  insert into public.families (display_name)
  values ('Isabel & Fabiano')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Isabel cristina', 'da silva', '5512992176440', 'female'), -- #100 Isabel cristina da silva
    ('Fabiano', 'frança', '', 'male') -- #101 Fabiano frança
) as g(first_name, last_name, phone, gender);

-- Family: Sebastião & Helenice
with inserted as (
  insert into public.families (display_name)
  values ('Sebastião & Helenice')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Sebastião Marcos', 'da Silva', '', 'male'), -- #102 Sebastião Marcos da Silva
    ('Helenice', '', '', 'female') -- #103 Helenice
) as g(first_name, last_name, phone, gender);

-- Family: Peterson & Fabiana
with inserted as (
  insert into public.families (display_name)
  values ('Peterson & Fabiana')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Peterson', 'Dimas', '5512982332897', 'male'), -- #104 Peterson Dimas
    ('Fabiana', 'Peterson', '', 'female') -- #105 Fabiana Peterson
) as g(first_name, last_name, phone, gender);

-- Family: Juliana
with inserted as (
  insert into public.families (display_name)
  values ('Juliana')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Juliana Clemente', 'Doria', '5512982602583', 'female') -- #107 Juliana Clemente Doria
) as g(first_name, last_name, phone, gender);

-- Family: Ubirajara & Geisa
with inserted as (
  insert into public.families (display_name)
  values ('Ubirajara & Geisa')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Ubirajara', 'Oliveira', '5512991404250', 'male'), -- #108 Ubirajara Oliveira
    ('Geisa', '', '', 'female') -- #109 Geisa
) as g(first_name, last_name, phone, gender);

-- Family: Claudia & Giovanni
with inserted as (
  insert into public.families (display_name)
  values ('Claudia & Giovanni')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Claudia', '', '', 'female'), -- #110 Claudia
    ('Giovanni', '', '', 'male') -- #111 Giovanni
) as g(first_name, last_name, phone, gender);

-- Family: Camila & Rafael
with inserted as (
  insert into public.families (display_name)
  values ('Camila & Rafael')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Camila', '', '', 'female'), -- #112 Camila
    ('Rafael', '', '', 'male') -- #113 Rafael
) as g(first_name, last_name, phone, gender);

-- Family: Renan & Gabi
with inserted as (
  insert into public.families (display_name)
  values ('Renan & Gabi')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Renan', '', '', 'male'), -- #114 Renan
    ('Gabi', '', '', 'female') -- #115 Gabi
) as g(first_name, last_name, phone, gender);

-- Family: Felipe
with inserted as (
  insert into public.families (display_name)
  values ('Felipe')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Felipe', 'Augusto', '5512982867158', 'male') -- #116 Felipe Augusto
) as g(first_name, last_name, phone, gender);

-- Family: Aline
with inserted as (
  insert into public.families (display_name)
  values ('Aline')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Aline', '', '', 'female') -- #117 Aline
) as g(first_name, last_name, phone, gender);

-- Family: Cleonice & família
with inserted as (
  insert into public.families (display_name)
  values ('Cleonice & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Cleonice', '', '5512988463948', 'female'), -- #118 Cleonice
    ('André', '', '', 'male'), -- #119 André
    ('Severo', '', '', 'male') -- #120 Severo
) as g(first_name, last_name, phone, gender);

-- Family: Aldine & família
with inserted as (
  insert into public.families (display_name)
  values ('Aldine & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Aldine', '', '5512991624890', 'female'), -- #121 Aldine
    ('Carlos', '', '', 'male'), -- #122 Carlos
    ('Cora', '', '', 'female') -- #123 Cora
) as g(first_name, last_name, phone, gender);

-- Family: Anderon & família
with inserted as (
  insert into public.families (display_name)
  values ('Anderon & família')
  returning id
)
insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)
select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status
from inserted
cross join (
  values
    ('Anderon', 'Oliveira', '5512992398399', 'male'), -- #124 Anderon Oliveira
    ('Aline', '', '', 'female'), -- #125 Aline
    ('Carlos', 'André', '5512991150795', 'male'), -- #126 Carlos André
    ('Tereza', '', '', 'female'), -- #127 Tereza
    ('Jean', '', '', 'male'), -- #128 Jean
    ('Bia', '', '', 'female') -- #129 Bia
) as g(first_name, last_name, phone, gender);

commit;

-- Quick checks
-- select count(*) as families from public.families;
-- select count(*) as guests from public.guests;
-- select count(*) as with_phone from public.guests where phone <> '';
-- select f.display_name, g.first_name, g.last_name, g.phone
-- from public.guests g join public.families f on f.id = g.family_id
-- order by f.display_name, g.first_name;