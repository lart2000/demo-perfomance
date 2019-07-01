-- users
insert into users values('e4a69aea-54be-411c-936e-06925d0ef5e4','SUPER ADMINISTRADOR','super_admin_gs','$2a$10$lRC.aiAZKBFHTSTCT1yZ4.gbMkzdo8eZvxMjBDitDZAwvPNb1eUAi','1','f2ce5314-0f62-470d-ab11-23a0ff6ae3de',now(),now());
insert into users values('c3707b68-6778-4995-90ab-7cd961774ca5','ADMINISTRADOR NOMBRE','admin','$2a$10$lRC.aiAZKBFHTSTCT1yZ4.gbMkzdo8eZvxMjBDitDZAwvPNb1eUAi','1','19bd5456-f510-454a-a589-a43f7f748aae',now(),now());

-- faculty
insert into faculties values('0646eba7-4158-4376-a12a-5ccb710d2947', 'Facultad de Ingeniería Industrial, Sistemas e Informática',now(),now());
insert into faculties values('3bc219a3-760a-46a4-a8dc-7a9c2c862606', 'Facultad de Ingeniería Civil',now(),now());

-- schools
insert into schools values('526f70dd-d902-494e-9111-6f6162e82dc2','Ing. Industrial','0646eba7-4158-4376-a12a-5ccb710d2947',now(),now());
insert into schools values('c9ba4c50-d6a7-482b-9a8e-8111d844b812','Ing. Sistemas','0646eba7-4158-4376-a12a-5ccb710d2947',now(),now());
insert into schools values('0a568464-9db0-4c8d-9568-b508711d2d3f','Ing. Informática','0646eba7-4158-4376-a12a-5ccb710d2947',now(),now());
insert into schools values('a93182a7-3e4c-416a-a614-bba1a64faed1','Ing. Electrónica','0646eba7-4158-4376-a12a-5ccb710d2947',now(),now());
insert into schools values('d7436c4e-4ad1-45bf-8e82-fc85bd1e93e9','Ing. Civil','3bc219a3-760a-46a4-a8dc-7a9c2c862606',now(),now());

-- roles
insert into roles values('f2ce5314-0f62-470d-ab11-23a0ff6ae3de','SUPER ADMINISTRADOR',now(),now());
insert into roles values('19bd5456-f510-454a-a589-a43f7f748aae','ADMINISTRADOR',now(),now());
insert into roles values('54fed9d3-2ffd-4cbf-84c0-9b9bc6c262c3','EDITOR',now(),now());

-- charges
insert into charges values('f363fa52-a718-48aa-8114-e9b8a0b5b0f6','Presidente',now(),now());
insert into charges values('99e060d9-20fd-4f49-b7df-6e2d9778726f','Secretario',now(),now());
insert into charges values('851c96ac-5fab-4a43-8c5d-3fbd299e199c','Vocal',now(),now());
