drop database if exists `core`;
create database `core`;

use core;

-- ***********************
-- core database section *
-- ***********************

-- table user core functionality
create table coreUser (
	localId smallint not null auto_increment,
    displayName varchar(50) not null,
    email varchar(256) not null unique,
    avatarUrl varchar(256),
    avatarFile varchar(256),
    `password` varchar(512) not null,
    salt varchar(512) not null,
    idToken varchar(256),
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (localId)
);

-- table feedback core functionality
create table coreFeedback (
    id int not null auto_increment,
    localId smallint not null,
    title varchar(50) not null,
    feedback varchar(300),
    approved bool not null default true,
    visability int not null default 100,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id),
    constraint fk_feedback_localId foreign key (localId) references coreUser (localId)
        on update cascade
        on delete cascade
);

-- ******************************************
-- Phobos Risk Application database section *
-- ******************************************

-- table risk locations
create table riskLocation (
    id int not null auto_increment,
    name varchar(50) not null,
    description varchar(200) not null,
    doc varchar(500),
    parentId int,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id),
    constraint fk_riskLocation_parentId foreign key (parentId) references riskLocation (id)
		on update cascade on delete cascade
);

-- table risk organisation areas
create table riskOrganisationArea (
    id int not null auto_increment,
    name varchar(50) not null,
    description varchar(200) not null,
    doc varchar(500),
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id)
);

-- table registered risk
create table registeredRisk (
    id int not null auto_increment,
    title varchar(50) not null,
    description varchar(500) not null,
    likelihoodImpactStatement varchar(500) not null,
    likelihoodScore tinyInt not null,
    appetiteScore tinyInt not null,
    healthSafetyImpactScore tinyInt not null,
    complianceImpactScore tinyInt not null,
    financialImpactScore tinyInt not null,
    serviceImpactScore tinyInt not null,
    humanResourceImpactScore tinyInt not null,
    projectImpactScore tinyInt not null,
    reputationImpactScore tinyInt not null,
    objectiveImpactScore tinyInt not null,
    publicityImpactScore tinyInt not null,
    status varchar(50) not null,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id)
);

create table registeredRiskLocation (
    id int not null auto_increment,
    riskId int not null,
    locationId int not null,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id),
    constraint fk_registeredRiskLocationRiskId foreign key (riskId) references registeredRisk (id)
		    on update cascade on delete cascade,
    constraint fk_registeredRiskLocationLocationId foreign key (locationId) references riskLocation (id)
		    on update cascade on delete cascade
);

create table registeredRiskKeyWordPhrase (
    id int not null auto_increment,
    riskId int not null,
    keyWordPhrase varchar(200) not null,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id)
);

create table registeredRiskArea (
    id int not null auto_increment,
    riskId int not null,
    areaId int not null,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id),
    constraint fk_registeredRiskAreaRiskID foreign key (riskId) references registeredRisk (id)
		    on update cascade on delete cascade,
    constraint fk_registeredRiskAreaAreaID foreign key (areaId) references riskOrganisationArea (id)
		    on update cascade on delete cascade
);

-- ***********************
-- intelliverse Sections *
-- ***********************

-- table intelliverse hold
create table intelliverseHold (
    id varchar(36) not null,
    universe varchar(50) not null,
    entry varchar(200),
    created datetime not null default now()
);

-- table intelliverse word
create table intelliverseWord (
	  word varchar(50) not null,
    occurrence int not null default 1,
    created datetime not null default now(),
    updated datetime default now() on update now(),
    primary key (word)
);

-- table intelliverse phrase
create table intelliversePhrase (
	  phrase varchar(200) not null,
    occurrence int not null default 1,
    created datetime not null default now(),
    updated datetime default now() on update now(),
    primary key (phrase)
);

-- table intelliverse universe
create table intelliverseUniverse (
	  universe varchar(50) not null,
    inuse boolean not null default true,
    created datetime default now(),
    primary key (universe)
);
insert into intelliverseUniverse(universe) values('risk');

-- table intelliverse entry
create table intelliverseEntry (
	  id varchar(36) not null,
    universe varchar(50) not null,
    created datetime default now(),
    primary key (id, universe),
    constraint fk_entry_universe foreign key (universe) references intelliverseUniverse (universe)
		on update cascade
);

-- table inteliverse collection
create table intelliverseEntryCollection (
	  id varchar(36) not null,
    entry_id varchar(36) not null,
    word varchar(50),
    phrase varchar(200),
    created datetime not null default now(),
    updated datetime default now() on update now(),
    primary key (id, entry_id),
    constraint fk_collection_entry foreign key (entry_id) references intelliverseEntry (id)
		    on update cascade on delete cascade,
    constraint fk_collection_word foreign key (word) references intelliverseWord (word)
		    on update cascade on delete cascade,
	  constraint fk_collection_phrase foreign key (phrase) references intelliversePhrase (phrase)
		    on update cascade on delete cascade
);

delimiter //
create trigger intelliverseTriggerSortEntryCollection
    before insert
        on intelliverseHold for each row
            begin
                -- insert new entry
                insert into intelliverseEntry (id, universe) values (new.id, new.universe)
                    on duplicate key update universe = new.universe;
                    -- insert into word or phrase
                    if (select locate(' ', new.entry) = 0) then
                        insert into intelliverseWord (word) values (new.entry)
                            on duplicate key update 
                                occurrence = occurrence + 1;
                        insert into intelliverseEntryCollection (id, entry_id, word) values (uuid(), new.id, new.entry);
                    else
                        insert into intelliversePhrase (phrase) values (new.entry)
                            on duplicate key update
                                occurrence = occurrence + 1, updated = current_timestamp;
                        insert into intelliverseEntryCollection (id, entry_id, phrase) values (uuid(), new.id, new.entry);
                    end if;
            end//
delimiter ;

-- ********************************************************************************
-- The FitMeIn Schema
-- added 2022-01-09
-- change:
--  1. initial fitmein schema - 2022-01-09
--  2. added appointmentDate to Spot table - 2022-01-20
--  3. added duration, purchasedDateTime, purchasedById to Spot table - 2022-01-24
--
-- ********************************************************************************

create table Spot (
    id int not null auto_increment,
    ownerUserId smallInt not null,
    title varchar(32) not null,
    description varchar(256),
    appointmentDateTime datetime not null,
    duration smallInt not null,
    price numeric(19,4) not null,
    inBasketDateTime datetime null,
    inBasketUserId smallInt null,
    purchaseOrderId int null,
    imageUrl varchar(512) not null,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    primary key (id),
    constraint fk_SpotOwnerUserId foreign key (ownerUserId) references coreUser (localId)
        on update cascade on delete cascade,
    constraint fk_SpotInBasketUserId foreign key (inBasketUserId) references coreUser (localId)
        on update cascade on delete cascade
);

create table `Order` (
    id int not null auto_increment,
    localId smallInt not null,
    basketItems json not null,
    total numeric(19, 4) not null,
    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,
    primary key (id),
    constraint fk_OrderLocalId foreign key (localId) references coreUser (localId)
        on update cascade on delete cascade
);