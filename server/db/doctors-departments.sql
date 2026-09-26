-- Sets each doctor's department to the "Department" column of the
-- "Doctors by Department" sheet in MendSure_Departments_Doctors_Hospitals.xlsx,
-- so the Doctors page can group each specialty into those departments.
-- Applied to the live database on 2026-09-26.

update doctors set department = 'Interventional Cardiology & Electrophysiology' where id = '66be2f90-3d9f-41a5-b025-77f606657b21'; -- dr-balbir-singh
update doctors set department = 'Cardiac Surgery' where id = 'ad229dc9-3504-468e-be29-27cbb7971921'; -- dr-prof-narendra-nath-khanna
update doctors set department = 'Cardiac Surgery' where id = 'c1d9820f-e1fb-48e6-9c12-d74edb4a46ac'; -- dr-bhaba-nanda-das
update doctors set department = 'Cardiac Surgery' where id = '732bf07d-d739-4ad1-b1ac-9c27bf1bf6bd'; -- dr-ajay-kaul
update doctors set department = 'Cardiac Surgery' where id = '05b1eaaf-f838-4a8d-9869-ef470c7a2502'; -- dr-dinesh-kumar-mittal
update doctors set department = 'Paediatric Cardiac Surgery' where id = '78b0f089-cb93-4f0c-b02b-57be4018a312'; -- dr-kulbhushan-singh-dagar
update doctors set department = 'Cardiac Surgery' where id = '6b63541e-5391-45d8-85d9-3bc45e706b47'; -- dr-rajneesh-malhotra
update doctors set department = 'Oncology Radiation' where id = '39313f3f-397e-4707-a98d-494c513e17c5'; -- dr-anil-kumar-anand
update doctors set department = 'Cardiac Surgery' where id = '72ec4b34-03be-424f-a697-dee703f14261'; -- dr-anil-bhan
update doctors set department = 'Electrophysiology and Arrhythmia' where id = 'e5fb475b-c092-4e1b-b9fd-2c265691a44d'; -- dr-anil-saxena
update doctors set department = 'Paediatric Cardiology' where id = '7f5e4548-339d-418a-b47c-bdd7be3a7243'; -- dr-anita-saxena
update doctors set department = 'Paediatric Cardiac Surgery' where id = '9df98024-47ef-4571-8b95-cee3beff711e'; -- dr-krishna-subramony-iyer
update doctors set department = 'Paediatric Cardiology' where id = '223184fe-8be6-4738-b506-a5cc11115556'; -- dr-parvathi-unninayar-iyer
update doctors set department = 'Cardiac Surgery' where id = '054a69d7-894f-47e1-9a65-e5387f3244dc'; -- dr-udgeath-dhir
update doctors set department = 'Haematology' where id = 'c850cd9e-dc52-4b9d-97a2-d01e9dce7dda'; -- dr-rahul-bhargava
update doctors set department = 'Interventional Cardiology' where id = 'd5b03ed4-ba9f-452f-846c-28c88c74ce12'; -- dr-s-s-bansal
update doctors set department = 'Cardiac Surgery' where id = '2d776d91-384d-468e-8c74-e81db86d4d02'; -- dr-sanjay-gupta
update doctors set department = 'Cardiac Surgery' where id = 'af922fc9-fc9a-4ab7-a197-b0ae3a3e9cc0'; -- dr-atul-mathur
update doctors set department = 'Electrophysiology and Arrhythmia' where id = 'ce8dc8ab-0da4-45b5-85d8-b867872ba0c3'; -- dr-niti-chadha-negi
update doctors set department = 'Cardiac Surgery' where id = '40b4eec8-c4e4-41b9-a611-ecad83c2bcd0'; -- dr-shiv-kumar-choudhary
update doctors set department = 'Cardiac Surgery' where id = '3ecc88b3-3355-4ded-a050-b2f9045f3ef3'; -- dr-naresh-trehan
update doctors set department = 'Cardiac Surgery' where id = '3f15a2fb-eefc-46aa-8e25-7111597dc811'; -- dr-ramji-mehrotra
update doctors set department = 'Cardiac Surgery' where id = 'ae630d2d-f523-4427-afdf-315d3869f54d'; -- dr-sanjeev-malhotra
update doctors set department = 'Non-Invasive Cardiology' where id = 'd13c7567-9463-47a0-b80a-27487563d3d0'; -- dr-vinayak-agrawal
update doctors set department = 'Interventional Cardiology' where id = 'b8dce587-8269-4a85-b89a-01d7fcaa2b7a'; -- dr-prof-sanjay-tyagi
update doctors set department = 'Interventional Cardiology' where id = '8dbc1481-0fba-4bd6-9dab-c9839f0291f4'; -- dr-d-k-jhamb
update doctors set department = 'ENT Oncology Surgery' where id = '52b076cf-4783-4320-badb-712d8a252123'; -- dr-biswajyoti-hazarika
update doctors set department = 'Haematology' where id = '66aff7da-d355-452a-85b3-e35ad6443da9'; -- dr-dharma-choudhary
update doctors set department = 'Oncology Gynaecology Surgery' where id = 'd0aee050-a5fe-4a9c-a4ab-3dbc7207dba8'; -- dr-rama-joshi
update doctors set department = 'Pediatric Haematology' where id = 'c64e54d6-2b75-40d1-90b5-bc7c2ec36514'; -- dr-vikas-dua
update doctors set department = 'Orthopaedic Oncology Surgery' where id = '724f0302-5508-47e3-a08b-138acba89c6b'; -- dr-vivek-verma
update doctors set department = 'Medical Oncology' where id = 'b9b991ac-1b20-45cb-ab89-177e81320fa9'; -- dr-mukesh-patekar
update doctors set department = 'Oncology Surgery' where id = '0b008207-8791-47ce-9349-25b7b14b9209'; -- dr-niranjan-naik
update doctors set department = 'Orthopaedics and Joint Replacement' where id = 'd551a69d-601a-4f7a-b92c-e12bf144dab9'; -- dr-ashok-rajgopal
update doctors set department = 'Orthopaedics and Joint Replacement' where id = 'db1f6007-0ffd-4f88-932f-12aeeed05b13'; -- dr-attique-vasdev
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '59f28a4a-34c7-45aa-80cc-e156e4000d25'; -- dr-raman-kant-aggarwal
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '9a5ecf6b-9588-4ec3-9683-31d842045c98'; -- dr-aashish-chaudhry
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '44171fbb-1604-450f-9ca8-f11bf8405e12'; -- dr-i-p-s-oberoi
update doctors set department = 'Paediatric Orthopaedics and Spine' where id = 'e6202fa0-8c4e-4775-bdeb-21ce27d1c3e5'; -- dr-sanjay-sarup
update doctors set department = 'Orthopaedics and Joint Replacement' where id = 'bbed97eb-ddc0-463e-b054-b9238d9007a5'; -- dr-vivek-dahiya
update doctors set department = 'Urology and Kidney Transplant Surgery' where id = 'c5f8e580-0ea2-4646-be54-1f906bd88052'; -- dr-pradeep-kumar-bansal
update doctors set department = 'Neuro and Spine Surgery' where id = 'aa8fc6d7-723a-4943-96f9-f47e7534a7ec'; -- dr-sandeep-vaishya
update doctors set department = 'Neurointerventional Radiology' where id = '7cb81fd1-0690-431a-96f7-e34299dc918c'; -- dr-vijay-kant-dixit
update doctors set department = 'Neuro and Spine Surgery' where id = '5fedf639-66c2-4c41-8398-763e02d219ac'; -- dr-sudhir-dubey
update doctors set department = 'Plastic and Reconstructive Surgery' where id = '0980fda7-0e59-488d-a888-f413fb91db19'; -- dr-avinash
update doctors set department = 'Plastic and Reconstructive Surgery' where id = 'f9525dfc-e717-430a-b372-eb756a303a24'; -- dr-vipul-nanda
update doctors set department = 'Scoliosis Surgery and Spine Surgery' where id = 'a233cf09-a237-4b80-b0af-814b583c2512'; -- dr-hamza-shaikh
update doctors set department = 'Liver Transplant and Hepatobiliary Sciences' where id = 'a681635e-f945-4625-ab46-65b77d804bd7'; -- dr-giriraj-bora
update doctors set department = 'ENT - Head and Neck Surgery' where id = 'a811e1d2-bf58-4ea8-941f-54c8920a2cb2'; -- dr-atul-kumar-mittal
update doctors set department = 'Gastroenterology and Hepatobiliary Sciences' where id = 'd1fc8a6d-78ad-44bf-96d4-e057f95fafbf'; -- dr-rinkesh-kumar-bansal
update doctors set department = 'General Surgery, General and Minimal Access' where id = '0cf77e39-46a9-41aa-a840-6aa31d83def9'; -- dr-rashmi-pyasi
update doctors set department = 'Electrophysiology and Arrhythmia' where id = '0c2914b3-76cc-4a3c-9d19-992c8bc2eae1'; -- dr-aparna-jaswal
update doctors set department = 'Oncology Radiation' where id = '6c900262-b71f-492d-91a6-70e20b0a5ffa'; -- dr-amal-roy-chaudhoory
update doctors set department = 'ENT - Head and Neck Surgery' where id = '3669b709-5e15-4aa4-a984-23a04e73e122'; -- dr-k-k-handa
update doctors set department = 'Peripheral Vascular and Endovascular Sciences' where id = 'a2ba56b9-d305-4683-8024-526f014e6a48'; -- dr-tarun-grover
update doctors set department = 'Rheumatology' where id = '30cc5c0f-7996-4c88-b9ab-bb3a78d81bab'; -- dr-naval-mendiratta
update doctors set department = 'Interventional Cardiology' where id = '6333c5d2-d44f-4afb-b26d-6e92d6153051'; -- dr-vijay-kumar-chopra
update doctors set department = 'Cardiac Surgery' where id = '797fdf24-a5d0-463c-b742-ba34ee8857b1'; -- dr-yugal-kishore-mishra
update doctors set department = 'Cardiac Surgery' where id = '41e04008-a7b8-4d1a-90f6-86ffde185140'; -- dr-z-s-meharwal
update doctors set department = 'ENT Oncology Surgery' where id = '41262901-e39d-4635-af50-ecb2f4b82ecd'; -- dr-deepak-sarin
update doctors set department = 'Oncology Surgery' where id = '5a18a4af-b5ad-4a92-a256-bd7e77a7229e'; -- dr-harit-kumar-chaturvedi
update doctors set department = 'ENT Oncology Surgery' where id = '09cf19f7-9ece-4dc7-a826-a656d0796d46'; -- dr-surender-kumar-dabas
update doctors set department = 'Nuclear Oncology' where id = 'efa67d49-08f4-4453-9674-136195e02acf'; -- dr-ishita-b-sen
update doctors set department = 'Oncology Surgery' where id = '8a528c87-a00d-4318-a162-f26dafa0b2ec'; -- dr-vedant-kabra
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '45dcdcf0-e508-40b7-8ee0-b8c024f0beab'; -- dr-prof-anil-arora
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '67a144f7-f57e-4f09-b095-a376e99d0a38'; -- dr-hemant-sharma
update doctors set department = 'Orthopaedics and Joint Replacement' where id = 'b42c0e8c-37e5-4c2c-b111-a6782062200b'; -- dr-jayant-arora
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '47f6c9e1-fc53-44cf-9078-8a956929280f'; -- dr-rohit-lamba
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '97556dd1-1498-456d-982c-9f31d3fdead3'; -- dr-subhash-jangid
update doctors set department = 'Orthopaedics and Joint Replacement' where id = '52c601ac-1a09-4bf7-bac6-5e212f621baf'; -- dr-vipin-chand-tyagi
update doctors set department = 'Liver Transplant and Hepatobiliary Sciences' where id = 'dd7f961a-2b66-4a5a-9e96-2b330b63f5d3'; -- dr-abhideep-chaudhary
update doctors set department = 'Liver Transplant and Hepatobiliary Sciences' where id = '0299ac67-dd43-4e05-9b07-cff4c015696a'; -- dr-vivek-vij
update doctors set department = 'Lung Transplant' where id = 'eeaf1b69-90ae-453f-aa5d-24ffa0f5b014'; -- dr-arvind-kumar
update doctors set department = 'Lung Transplant' where id = '017b46c4-3bd0-44fd-b7c3-a8925b03b305'; -- dr-belal-bin-asaf
update doctors set department = 'Urology and Kidney Transplant Surgery' where id = '858b2e37-ad58-4b92-bb2a-97e91b87d1c3'; -- dr-sanjay-gogoi
update doctors set department = 'Nephrology & Kidney Transplant Medicine' where id = 'ece3a849-887a-4666-bd7e-df2b94d25cab'; -- dr-saurabh-pokhriyal
update doctors set department = 'Pulmonology & Sleep Medicine' where id = '5ed123a7-aef3-46cb-a79f-54a9d90e823f'; -- dr-manoj-kumar-goel
update doctors set department = 'Neuro and Spine Surgery' where id = '55336aec-9152-4c7f-819e-7400c98a0c78'; -- dr-rana-patir
update doctors set department = 'Neuro and Spine Surgery' where id = '63c78f1a-6015-4470-8bc3-ff39db495abd'; -- dr-rohit-bansil
update doctors set department = 'Neurointerventional Radiology' where id = 'd793ad60-ba63-46b7-84b4-7fcce205fae4'; -- dr-tariq-matin
update doctors set department = 'Gastroenterology and Hepatobiliary Sciences' where id = '89535f26-8eef-4123-9ecf-2d3f7455efe2'; -- dr-gourdas-choudhuri
update doctors set department = 'General Surgery, General and Minimal Access' where id = '7e309826-7207-49f5-872c-5d236fa60941'; -- dr-ajay-kumar-kriplani
update doctors set department = 'Peripheral Vascular and Endovascular Sciences' where id = '9ceabb32-1b70-4bf9-a785-634e257a7b06'; -- dr-rajiv-parakh
update doctors set department = 'Scoliosis Surgery and Spine Surgery' where id = '0e8a7fd2-6779-481e-b777-ae4abe348af5'; -- dr-hitesh-garg
update doctors set department = 'Urology and Kidney Transplant Surgery' where id = 'c158ca76-dda4-41f7-a5f8-05641e70d6f9'; -- dr-anil-mandhani
update doctors set department = 'Neuro and Spine Surgery' where id = 'f6723cf9-2218-4fe9-9b8e-9b17303da787'; -- dr-harnarayan-singh
update doctors set department = 'Pediatrics and Pediatric Surgery' where id = 'e0455513-f74f-4325-bb10-d9580bb81fd5'; -- dr-anand-sinha
update doctors set department = 'Urology and Kidney Transplant Surgery' where id = 'c7f62daf-53b5-473b-a2e7-e1eb4795f94f'; -- dr-shafiq-ahmed
update doctors set department = 'Nephrology & Kidney Transplant Medicine' where id = '253ec554-f1d4-4e8c-8ae7-fdf586488917'; -- dr-salil-jain
update doctors set department = 'Urology and Kidney Transplant Surgery' where id = 'f3ba5113-717e-41bf-919e-7d06ad87159c'; -- dr-anant-kumar
update doctors set department = 'Nephrology & Kidney Transplant Medicine' where id = '0f093eb4-7854-46bd-8a34-97aa94187431'; -- dr-gagan-deep-chhabra
update doctors set department = 'CNS Radiosurgery, Neuro-oncology & Neurosurgery' where id = 'f25167ce-e518-4930-a80f-f86793a9d59f'; -- dr-aditya-gupta
update doctors set department = 'Oncology Gynaecology Surgery' where id = 'fb5e51c1-b4c5-475e-b916-bc8131405d31'; -- dr-sabhyata-gupta
