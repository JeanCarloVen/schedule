CREATE DATABASE schedule_app;

USE schedule_app;

-- DONE
CREATE TABLE client
(
    id INT AUTO_INCREMENT NOT NULL,
    code_client VARCHAR(6) NOT NULL,
    client_name VARCHAR(3s0) NOT NULL,
    middle_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    mail VARCHAR(60) NOT NULL,
    phone VARCHAR(15) NULL,
    CONSTRAINT pk_client PRIMARY KEY (id)
)ENGINE = InnoDB;

-- DONE
CREATE TABLE supplier
(
    id INT AUTO_INCREMENT NOT NULL,
    code_supplier VARCHAR(6) NOT NULL,
    supplier_name VARCHAR(60) NOT NULL,
    business VARCHAR(15) NOT NULL,
    city VARCHAR(60) NOT NULL,
    country VARCHAR(30) NOT NULL,
    postcode VARCHAR(5) NOT NULL,
    township VARCHAR(30) NOT NULL,
    street_name VARCHAR(60) NOT NULL,
    suburb VARCHAR(30) NOT NULL, 
    state_sup VARCHAR(30) NOT NULL,
    CONSTRAINT uq_code_supplier UNIQUE (code_supplier),
    CONSTRAINT pk_supplier PRIMARY KEY (id)
)ENGINE = InnoDB;

-- DONE
CREATE TABLE service
(
    id INT AUTO_INCREMENT NOT NULL,
    id_supplier INT NOT NULL,
    code_service VARCHAR(6) NOT NULL,
    service_name VARCHAR(60) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    status CHAR(3) NOT NULL,
    CONSTRAINT pk_service PRIMARY KEY (id),
    CONSTRAINT uq_code_service UNIQUE (code_service),
    CONSTRAINT fk_service_supplier FOREIGN KEY (id_supplier) REFERENCES supplier(id)
)ENGINE = InnoDB;

--DONE
CREATE TABLE working_days
(
    id INT AUTO_INCREMENT NOT NULL, 
    days CHAR(7) NOT NULL,
    CONSTRAINT pk_working_days PRIMARY KEY (id)    
)ENGINE = InnoDB;


-- DONE
CREATE TABLE working_days_schedule_supplier
(
    id INT AUTO_INCREMENT NOT NULL,
    id_supplier INT NOT NULL,
    id_working_days INT NOT NULL,
    start_wd TIME NOT NULL,
    end_wd TIME NOT NULL,
    CONSTRAINT pk_working_days_schedule_supplier PRIMARY KEY (id),
    CONSTRAINT working_days_schedule_supplier_sup FOREIGN KEY (id_supplier) REFERENCES supplier(id),
    CONSTRAINT working_days_schedule_supplier_wor FOREIGN KEY (id_working_days) REFERENCES working_days(id),
)ENGINE = InnoDB;

-- DONE
CREATE TABLE working_days_schedule_staff
(
    id INT AUTO_INCREMENT NOT NULL,
    id_staff INT NOT NULL,
    id_working_days INT NOT NULL,
    start_wd TIME NOT NULL,
    end_wd TIME NOT NULL,
    CONSTRAINT pk_working_days_staff PRIMARY KEY (id),
    CONSTRAINT working_days_schedule_staff_sta FOREIGN KEY (id_staff) REFERENCES staff(id),
    CONSTRAINT working_days_schedule_staff_wor FOREIGN KEY (id_working_days) REFERENCES working_days(id),
)ENGINE = InnoDB;

-- DONE
CREATE TABLE staff
(
    id INT AUTO_INCREMENT NOT NULL,
    id_supplier INT NOT NULL,
    staff_name VARCHAR(30) NOT NULL,
    middle_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    birthday DATETIME NOT NULL,
    mail VARCHAR(60) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    city VARCHAR(60) NULL,
    country VARCHAR(30) NOT NULL,
    postcode VARCHAR(5) NULL,
    township VARCHAR(30) NULL,
    street_name VARCHAR(60) NULL,
    suburb VARCHAR(30) NULL, 
    status CHAR(3) NOT NULL,
    CONSTRAINT pk_staff PRIMARY KEY (id),
    CONSTRAINT fk_staff_supplier FOREIGN KEY (id_supplier) REFERENCES supplier(id)
)ENGINE = InnoDB;

--DONE
CREATE TABLE service_staff
(
    id INT AUTO_INCREMENT NOT NULL,
    date_up DATETIME NOT NULL,
    id_service INT NOT NULL,
    id_staff INT NOT NULL,
    CONSTRAINT pk_service_staff PRIMARY KEY (id, date_up),
    CONSTRAINT fk_service_staff_serv FOREIGN KEY (id_service) REFERENCES service(id),
    CONSTRAINT fk_service_staff_staf FOREIGN KEY (id_staff) REFERENCES staff(id)
)ENGINE = InnoDB;

-- DONE
CREATE TABLE promotion
(
    id INT AUTO_INCREMENT NOT NULL,
    date_up DATETIME NOT NULL,
    id_service INT NOT NULL,
    code_promo VARCHAR(10) NOT NULL,
    type_promo CHAR(3) NOT NULL,
    name_promo   VARCHAR(30) NOT NULL,
    value_promo VARCHAR(30) NOT NULL,
    expiration_start DATE NOT NULL,
    expiration_end DATE NOT NULL,
    points INT NULL,
    CONSTRAINT pk_promotion PRIMARY KEY (id, date_up),
    CONSTRAINT fk_promotion_ser FOREIGN KEY (id_service) REFERENCES service(id)
)ENGINE = InnoDB;

CREATE TABLE client_type
(
    id INT AUTO_INCREMENT NOT NULL,
    id_client INT NOT NULL,
    id_supplier INT NOT NULL,
    client_type VARCHAR(10) NOT NULL,
    number_services INT NULL,
    CONSTRAINT pk_client_type PRIMARY KEY id,
    CONSTRAINT fk_client_type_clie FOREIGN KEY (id_client) REFERENCES client(id),
    CONSTRAINT fk_client_type_supp FOREIGN KEY (id_supplier) REFERENCES supplier(id)
)ENGINGE = InnoDB;

CREATE TABLE membership
(
    id INT AUTO_INCREMENT NOT NULL,
    id_client INT NOT NULL,
    membership_type VARCHAR(10) NOT NULL,
    expiration DATE NOT NULL,
    credit DECIMAL(12,2) NULL,
    points INT NULL,
    CONSTRAINT pk_membership PRIMARY KEY id,
    CONSTRAINT fk_membership_client FOREIGN KEY (id_client) REFERENCES client(id)
)ENGINE = InnoDB;


CREATE TABLE membership_supplier
(
    id INT AUTO_INCREMENT NOT NULL,
    id_membership INT NOT NULL,
    id_supplier INT NOT NULL,
    discount DECIMAL(4,2) NULL,
    CONSTRAINT pk_membership_supplier PRIMARY KEY id,
    CONSTRAINT fk_membership_supplier_mem FOREIGN KEY (id_membership) REFERENCES membershio(id),
    CONSTRAINT fk_membership_supplier_sup FOREIGN KEY (id_supplier) REFERENCES supplier(id)
)ENGINE = InnoDB;


CREATE TABLE booking
(
    id INT AUTO_INCREMENT NOT NULL,
    id_service_staff INT NOT NULL,
    id_client INT NOT NULL,
    id_promotion INT NULL,
    working_day VARCHAR(13) NOT NULL,
    ticket VARCHAR(13) NOT NULL,
    status CHAR(3) NOT NULL,
    date_Up DATETIME NOT NULL,
    dateBooked DATETIME NOT NULL,
    dateBooked_start TIME NOT NULL,
    dateBooked_end TIME NOT NULL,   
    CONSTRAINT uq_ticket UNIQUE (ticket),
    CONSTRAINT pk_booking PRIMARY KEY (id),
    CONSTRAINT fk_booking_service_staff FOREIGN KEY (id_service_staff) REFERENCES service_staff(id),
    CONSTRAINT fk_booking_client FOREIGN KEY (id_client) REFERENCES client(id),
    CONSTRAINT fk_booking_promotion FOREIGN KEY (id_promotion) REFERENCES promotion(id)
)ENGINE = InnoDB;



-- CLIENTS TEST
INSERT INTO client VALUES(NULL, "JECRVE", "JEAN CARLO", "CRUZ", "VENEGAS", "ASESOR.JCV@GMAIL.COM", "5570741516");
INSERT INTO client VALUES(NULL, "CLZAGU", "CLAUDIA", "ZAMUDIO", "GUALITO", "GUALITA74@GMAIL.COM", "5520458476");
INSERT INTO client VALUES(NULL, "SOARDO", "SOFIA", "ARROLLO", "DOMINGUEZ", "SOFIA.ARR@GMAIL.COM", "5520451678");
  
-- SUPPLIERS TEST
INSERT INTO supplier VALUES(NULL, "PELELG", "PELUQUERIA EL GIRASOL", "PELUQUERIA", "CIUDAD DE MEXICO", "MEXICO", "14370", "TLALPAN", "MIRAMONTES 245","HACIENDA SAN JUAN", "ACT" );
INSERT INTO supplier VALUES(NULL, "BARGUT", "BARBERIA GUTIERRITOS", "BARBERIA", "CIUDAD DE MEXICO", "MEXICO", "17580", "BENITO JUAREZ", "NEPAL 45","BUENAS NOCHES", "ACT" );
INSERT INTO supplier VALUES(NULL, "CEJLAM", "CEJAS LA MANSION", "ESTETICA", "CIUDAD DE MEXICO", "MEXICO", "14850", "ALVARO OBREGON", "SINGAPUR 1897","ACUEDUCTO", "INA" );

-- SERVICES TEST

INSERT INTO service VALUES(NULL, "3", "CESLSH", "CEJAS SLASH", "CEJAS CON TÉCNICA ULTRA RÁPIDA SLASH", 500, "ACT");
INSERT INTO service VALUES(NULL, "3", "CESHUT", "CEJAS SHORTCUT", "CORTE DE CEJAS Y DEPILACION", 500, "ACT");
INSERT INTO service VALUES(NULL, "2", "COBACH", "CORTE BARBA CHICA", "CORTE DE BARBA DE ALTURA CHICA MENOR A 3 CM", 130, "ACT");
INSERT INTO service VALUES(NULL, "2", "COBAME", "CORTE BARBA MEDIANA", "CORTE DE BARBA DE ALTURA MEDIANA MENOR A 7 CM", 150, "ACT");
INSERT INTO service VALUES(NULL, "2", "COBAGR", "CORTE BARBA GRANDE", "CORTE DE BARBA DE ALTURA GRANDE MENOR A 10 CM", 150, "ACT");
INSERT INTO service VALUES(NULL, "1", "TICALO", "TINTE CABELLO", "TINTE PARA CABELLO CON QUIMICOS", 230, "ACT");
INSERT INTO service VALUES(NULL, "1", "TICARU", "TINTE CABELLO RUBIO", "TINTE PARA CABELLO RUBIO", 580, "ACT");

-- STAFF TEST

INSERT INTO staff 
VALUES(NULL, 01, "LORENZA", "JIMENEZ", "CHAVEZ", '1987-03-25', "LORENZA@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );
INSERT INTO staff 
VALUES(NULL, 01, "BENITO", "FUENTES", "GOMEZ", "1985-12-25", "LORENZA@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );
INSERT INTO staff 
VALUES(NULL, 02, "JORGE", "CRUZ", "VENEGAS", "1997-03-14", "JORGE@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );
INSERT INTO staff 
VALUES(NULL, 02, "ANNIA", "RIVERA", "LOPEZ", "1992-05-10", "ANNIA@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );
INSERT INTO staff 
VALUES(NULL, 02, "FERNANDA", "MARQUEZ", "SLAYDER", "1991-04-08", "FERNANDA@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );
INSERT INTO staff 
VALUES(NULL, 03, "WELLOW", "SADE", "POWERS", "2001-08-20", "WELLOW@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );
INSERT INTO staff 
VALUES(NULL, 03, "BUFFY", "SUMMERS", "MORGANA", "2014-07-12", "BUFFY@GMAIL.COM", "5570741516", "CIUDAD DE MEXICO", "MEXICO", "14370", "HACIENDA SAN JUAN", "DOMINGO SABIO 2", "TLALPAN", "ACT" );

-- SERVICIOS_STAFF TEST
INSERT INTO service_staff
VALUES(NULL, NOW(), 01, 04);
INSERT INTO service_staff
VALUES(NULL, NOW(), 01, 05);
INSERT INTO service_staff
VALUES(NULL, NOW(), 02, 05);
INSERT INTO service_staff
VALUES(NULL, NOW(), 02, 06);
INSERT INTO service_staff
VALUES(NULL, NOW(), 03, 04);
INSERT INTO service_staff
VALUES(NULL, NOW(), 03, 05);

-- PROMOTION

INSERT INTO promotion
VALUES(NULL, NOW(), 01, "CEJLAM", "DES", "CEJAS 2X1", "2X1", "2021-07-02", "2021-09-10", 150);
INSERT INTO promotion
VALUES(NULL, NOW(), 01, "CORLLO", "DES", "CORTE CABELLO 20%", "20%", "2021-07-18", "2021-10-10", 200);
INSERT INTO promotion
VALUES(NULL, NOW(), 01, "UÑAS01", "PRO", "UÑAS 10%", "10%", "2021-05-13", "2021-06-10", 250);
INSERT INTO promotion
VALUES(NULL, NOW(), 02, "UÑAS02", "PRO", "UÑAS 15%", "15%", "2021-01-10", "2021-02-10", 300);
INSERT INTO promotion
VALUES(NULL, NOW(), 02, "UÑAS03", "DES", "UÑAS 50%", "50%", "2021-03-28", "2021-04-10", 80);
INSERT INTO promotion
VALUES(NULL, NOW(), 03, "UÑAS04", "DES", "UÑAS 60%", "60%", "2021-04-28", "2021-05-10", 100);
INSERT INTO promotion
VALUES(NULL, NOW(), 04, "UÑAS05", "DES", "UÑAS 70%", "70%", "2021-05-28", "2021-06-10", 170);
INSERT INTO promotion
VALUES(NULL, NOW(), 05, "UÑAS06", "DES", "UÑAS 80%", "80%", "2021-06-28", "2021-07-10", 1200);

-- BOOKING TEST

INSERT INTO booking
VALUES(NULL, 01, 01, 01, "MONDAY", "TIF092345", "ACT", NOW(), date_add(curdate(),interval 2 day), "10:30:10", "11:30:00");
INSERT INTO booking
VALUES(NULL, 01, 01, 01, "MONDAY", "TIF092346", "ACT", NOW(), date_add(curdate(),interval 5 day), "10:30:10", "11:30:00");
INSERT INTO booking
VALUES(NULL, 01, 01, 01, "MONDAY", "TIF092370", "ACT", NOW(), "2021-07-05", "19:30:10", "21:30:00");
INSERT INTO booking
VALUES(NULL, 02, 02, 01, "MONDAY", "TIF092371", "ACT", NOW(), "2021-07-05", "12:00:00", "12:30:00");
INSERT INTO booking
VALUES(NULL, 03, 03, 01, "MONDAY", "TIF092372", "ACT", NOW(), "2021-07-05", "12:30:10", "13:30:00");
INSERT INTO booking
VALUES(NULL, 01, 01, 01, "MONDAY", "TIF092373", "ACT", NOW(), "2021-07-05", "13:30:10", "15:30:00");
INSERT INTO booking
VALUES(NULL, 02, 01, 08, "TUESDAY", "TIF092347", "INA", NOW(), date_add(curdate(),interval 10 day), "12:00:10", "12:30:00");
INSERT INTO booking
VALUES(NULL, 02, 02, 09, "TUESDAY", "TIF092348", "INA", NOW(), date_add(curdate(),interval 15 day), "13:30:10", "14:30:00");
INSERT INTO booking
VALUES(NULL, 02, 03, 06, "WEDNESDAY", "TIF092349", "ACT", NOW(), date_add(curdate(),interval 20 day), "12:00:10", "15:00:00");
INSERT INTO booking
VALUES(NULL, 03, 01, 05, "WEDNESDAY", "TIF092350", "ACT", NOW(), date_add(curdate(),interval 25 day), "16:00:10", "17:30:00");
INSERT INTO booking
VALUES(NULL, 03, 02, 06, "THURSDAY", "TIF092351", "ACT", NOW(), date_add(curdate(),interval 8 day), "17:00:00", "18:30:00");
INSERT INTO booking
VALUES(NULL, 04, 01, 05, "THURSDAY", "TIF092352", "INA", NOW(), date_add(curdate(),interval 13 day), "18:30:00", "19:00:00");
INSERT INTO booking
VALUES(NULL, 05, 02, 02, "FRIDAY", "TIF092353", "ACT", NOW(), date_add(curdate(),interval 15 day), "18:00:10", "19:00:00");
INSERT INTO booking
VALUES(NULL, 06, 03, 04, "FRIDAY", "TIF092354", "INA", NOW(), date_add(curdate(),interval 28 day), "19:30:10", "21:30:00");

-- WORKING_DAY TEST

INSERT INTO working_days
VALUES(NULL, "MONDAY");
INSERT INTO working_days
VALUES(NULL, "TUESDAY");
INSERT INTO working_days
VALUES(NULL, "WEDNESDAY");
INSERT INTO working_days
VALUES(NULL, "THURSDAY");
INSERT INTO working_days
VALUES(NULL, "FRIDAY");
INSERT INTO working_days
VALUES(NULL, "SATURDAY");
INSERT INTO working_days
VALUES(NULL, "SUNDAY");
INSERT INTO working_days
VALUES(NULL, "MON-FRI");
INSERT INTO working_days
VALUES(NULL, "TUE-SUN");
INSERT INTO working_days
VALUES(NULL, "TUE-SAT");
INSERT INTO working_days
VALUES(NULL, "FRI-SUN");


-- WORKING_DAYS_SHEDULE_STAFF TEST
INSERT INTO working_days_schedule_staff
VALUES(NULL, 01, 27, "09:00", "18:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 02, 28, "09:00", "18:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 03, 29, "08:00", "17:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 04, 30, "09:00", "20:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 05, 20, "09:00", "18:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 05, 21, "09:00", "18:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 05, 22, "09:00", "18:00" );
INSERT INTO working_days_schedule_staff
VALUES(NULL, 05, 24, "09:00", "15:00" );

-- WORKING_DAYS_SCHEDULE_SUPPLIER TEST

INSERT INTO working_days_schedule_supplier
VALUES (NULL, 01, 27, "09:00", "18:00");
INSERT INTO working_days_schedule_supplier
VALUES (NULL, 02, 28, "09:00", "18:00");
INSERT INTO working_days_schedule_supplier
VALUES (NULL, 03, 29, "08:00", "17:00");




-- Necesito id_suppler, id_service, staf[], day(monday), work_time[star, end], avalible_time[]
-- Obtenemos los días y horarios del proveedor
SELECT id_supplier, id_working_days, schedule_wd FROM working_days_supplier WHERE id_supplier = $id_supplier;

id_supplier || id_working_days || schedule_wd
    4               2[L-V]             5["09:00" - "20:00"]
-----------------------------------------------------------
id_supplier || id_working_days || schedule_wd
    3               0[monday]         =>      5["09:00" - "20:00"]
    3               1[tuesday]        =>       7["09:00" - "16:00"]
    3               2[wednesday]        =>      8["09:00" - "17:00"]


-- Se descargan todos los días que tenga el proveedor junto con su horario, en el momento de seleccionar el proveedor
-- Conversión a formato JSON
{
    "id_supplier" : 03
    "monday" : {
            "work_time" : ["start_time" : "09:00", "end_time" : "20:00"],
        }
    "tuesday" : {
            "work_time" : ["start_time" : "09:00", "end_time" : "16:00"],
        }
    "wednesday" : {
            "work_time" : ["start_time" : "09:00", "end_time" : "17:00"],
        }
        ...
}

Una vez seleccionado el proveedor, se selecciona el servicio.

Al momento de seleccionar el día:
    - Se valida si el día esta dentro de los días laborales del proveedor
    - Si es verdadero, se mostrará la disponibilidad
        - horarios disponibles 

Al seleccionar el horario
    - Se valida si es un horario correcto
    - Si es verdadero, se mostrará al staff
        - staff de esos horarios


DISPONIBILIDAD (Ocupacion)

CONSULTA en el booking que mostrará la ocupación de ese día

SELECT  dateBooked, working_day, dateBooked_start, dateBooked_end, id_service_staff 
FROM booking 
WHERE dateBooked = "2021-07-05" AND status = 'ACT';
dateBooked  || working_day  || dateBooked_start || dateBooked_end   ||  id_service_staff
"2021-07-06"      "monday"          "09:00"         "10:00"                 1          
"2021-07-06"      "monday"          "10:00"         "11:30"                 1            
"2021-07-06"      "monday"          "11:30"         "12:30"                 2          

SELECT id_service, service_name 
FROM service_staff 
INNER JOIN service ON service_staff.id_service = service.id;
id_service  ||  service_name
    1             "COLBA"
    2             "UÑA01"
    5             "UÑA02"


JUNTANDO LAS ANTERIORES TENEMOS:
SELECT  b.dateBooked, b.working_day, b.dateBooked_start, b.dateBooked_end, b.id_service_staff, s.service_name
FROM booking AS b, service AS s 
WHERE b.dateBooked = "2021-07-05" AND b.status = 'ACT'

SELECT *
FROM service_staff AS ss
INNER JOIN booking AS b ON b.id_service_staff = ss.id
INNER JOIN service AS s ON ss.id_service = s.id
INNER JOIN staff AS st ON ss.id_staff = st.id
WHERE b.dateBooked = "2021-07-05" AND b.status = 'ACT';


SELECT b.dateBooked, b.working_day, b.dateBooked_start, b.dateBooked_end, s.lapse_time, 
        st.id, st.staff_name, s.id, s.service_name 
FROM service_staff AS ss
INNER JOIN booking AS b ON b.id_service_staff = ss.id
INNER JOIN service AS s ON ss.id_service = s.id
INNER JOIN staff AS st ON ss.id_staff = st.id
WHERE b.dateBooked = "2021-07-05" AND b.status = 'ACT';

SELECT b.dateBooked, b.working_day, b.dateBooked_start, b.dateBooked_end, s.lapse_time, 
        st.id, st.staff_name, s.id, wd.id_working_days, wd.start_wd, wd.end_wd, s.service_name 
FROM service_staff AS ss
INNER JOIN booking AS b ON b.id_service_staff = ss.id
INNER JOIN service AS s ON ss.id_service = s.id
INNER JOIN staff AS st ON ss.id_staff = st.id
INNER JOIN working_days_schedule_staff AS wd ON wd.id_staff = st.id
WHERE b.dateBooked = "2021-07-05" AND b.status = 'ACT'
GROUP BY wd.id_working_days;




EL PHP debe de convertir la ocupación a disponiblidad y enviar sólo los horarios disponibles

-------------------------------------------------------------------------------------------


-- DISPONIBILIDAD DE HORARIO EN GRAL Y POR STAFF
-- Conversión a formato JSON
{
    "dateBooked" : 2021-07-28,
    "working_day" : "monday",
    "available_time_general" : [
        {"dateBooked_start" : "12:30", "dateBooked_end" : "13:30", "lapse_time" : "60"},
        {"dateBooked_start" : "13:30", "dateBooked_end" : "14:00", "lapse_time" : "30"}
    ],
    "staff" : [
        {
            "id" : 05,
            "name" : "FERNANDA",
            "id_service" : 02,
            "Service" : CORTE CABELLO, 
            "avalible_time" : [
                    {"dateBooked_start" : "12:3 0", "dateBooked_end" : "13:30", "lapse_time" : "60"},
                    {"dateBooked_start" : "13:30", "dateBooked_end" : "14:00", "lapse_time" : "30"}
            ]
            
        }
        ,
        {
            "id" : 25,
            "name" : "Lorenza",
            "avalible_time" : [
                    {"dateBooked_start" : "12:30", "dateBooked_end" : "13:30", "lapse_time" : "60"},
                    {"dateBooked_start" : "13:30", "dateBooked_end" : "14:00", "lapse_time" : "30"}
                ]
            "services" :  [
                {   
                   "id_service" : 03,
                   "Services" : PINTADO DE UÑAS,
                }
                ,
                {   
                   "id_service" : 05,
                   "Services" : PINTADO DE UÑAS LARGAS
                }
   
            ]
            
        }
    ]
                
}

-----------------------------------
-- INICIO: SUPPLIER CON DIA y HORARIO LABORAL
SELECT *
FROM supplier AS s 
INNER JOIN working_days_schedule_supplier AS wds ON s.id = wds.id_supplier
INNER JOIN working_days AS wd ON wds.id_working_days = wd.id;

SELECT s.id AS id_Supplier, s.supplier_name AS Supplier_Name, wd.days AS Working_Days, wds.start_wd AS Start, wds.end_wd AS End
FROM supplier AS s 
INNER JOIN working_days_schedule_supplier AS wds ON s.id = wds.id_supplier
INNER JOIN working_days AS wd ON wds.id_working_days = wd.id;


-- INICIO: SUPPLIER SIN DIA NI HORARIO LABORAL
SELECT s.id AS id_Supplier, s.supplier_name AS Supplier_Name FROM supplier AS s;
-----------------------------------
--  SE OBTIENE DEL PROVEEDOR EL LOS SERVICIOS Y LOS DÍAS Y HORARIOS DEL PROVEEDOR:
-- INCOME => SUPPLIER_ID, SERVICE_ID

SELECT * 
FROM supplier AS s
INNER JOIN service AS ser ON s.id = ser.id_supplier
INNER JOIN working_days_schedule_supplier AS wds ON s.id = wds.id_supplier
INNER JOIN working_days AS wd ON wds.id_working_days = wd.id
WHERE s.id = 1;

SELECT s.id AS ID_Supplier, s.code_supplier AS COD_Supplier, ser.id AS ID_Service, ser.code_service AS COD_Service, ser.service_name AS Service_Name , ser.lapse_time AS LT_Service, wds.start_wd AS Start, wds.end_wd AS End, wd.days AS Day
FROM supplier AS s
INNER JOIN service AS ser ON s.id = ser.id_supplier
INNER JOIN working_days_schedule_supplier AS wds ON s.id = wds.id_supplier
INNER JOIN working_days AS wd ON wds.id_working_days = wd.id
WHERE s.id = 1;

SELECT s.id AS ID_Supplier, s.code_supplier AS COD_Supplier, ser.id AS ID_Service, ser.code_service AS COD_Service, ser.service_name AS Service_Name , ser.lapse_time AS LT_Service, wds.start_wd AS Start, wds.end_wd AS End, wd.days AS Day
FROM supplier AS s
INNER JOIN service AS ser ON s.id = ser.id_supplier
INNER JOIN working_days_schedule_supplier AS wds ON s.id = wds.id_supplier
INNER JOIN working_days AS wd ON wds.id_working_days = wd.id
WHERE s.id =: id_supplier;


SELECT * FROM service WHERE id_supplier=:id_supplier

-----------------------------------
ATIENDE DEL STAFF(esta anidada dentro de Disponibilidad)

SELECT id_service, service, id_staff, staff_name FROM service-staff WHERE id_service = $service;

id_service             || service              ||     id_staff        || staff_name
    08(Corte Cabello)      CORTE DE CABELLO            23(Juan)            Lorenza
    08(Corte Cabello)      CORTE DE CABELLO            25(Leonora)         Juan












    
