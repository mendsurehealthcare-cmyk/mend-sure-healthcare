-- Re-categorises every doctor to the specialty list in
-- MendSure_Departments_Doctors_Hospitals.xlsx ("Doctors by Department").
-- The 103 doctors in that sheet take its Specialty column exactly; the
-- other doctors are merged into the nearest of its categories.
-- Applied to the live database on 2026-09-26.

update doctors set specialty = 'Gastroenterology' where id = '16641e64-6743-454f-8e12-7a3bb4f2cd69'; -- dr-subrat-kumar-acharya: Liver & Digestive Diseases
update doctors set specialty = 'Urology Care' where id = 'f5d79f4f-30f9-42ca-a8fb-9ed1acfb114f'; -- dr-anil-kumar-gulia: Urology & Renal Transplant
update doctors set specialty = 'Urology Care' where id = 'd690dea1-8fa6-49ea-88f0-977c5b521e2f'; -- dr-ruchir-maheshwari: Urology & Renal Transplant
update doctors set specialty = 'Neurosurgery' where id = 'c17967bc-8e2b-40a2-9de2-11b66d78251e'; -- dr-bipin-walia: Neurosciences
update doctors set specialty = 'Oncology Care' where id = '9b9da833-ca21-4a00-9401-3dbaa4886e57'; -- dr-devavrat-arya: Oncology & Haematology
update doctors set specialty = 'Neurosurgery' where id = '6d54030b-9dd4-4394-98d4-055462dcef79'; -- dr-neha-kapoor: Neurosciences
update doctors set specialty = 'Cardiac Care' where id = 'caf34f5a-09df-4d0b-b4e8-dda16be0de40'; -- dr-gajinder-kumar-goyal: Cardiac Sciences
update doctors set specialty = 'Neurosurgery' where id = '888c3927-eeea-4ab8-8d70-d0d94424e2d4'; -- dr-madhuri-behari: Neurosciences
update doctors set specialty = 'Cardiac Care' where id = '23fed66d-52ab-4708-bb63-967b2b097fff'; -- dr-rakesh-rai-sapra: Cardiac Sciences
update doctors set specialty = 'Orthopaedic Care' where id = '79e95ccd-7300-4ae4-80b0-c143a9027891'; -- dr-anurag-aggarwal: Orthopaedics & Joint Replacement
update doctors set specialty = 'Neurosurgery' where id = '2c1000d0-7f11-441e-84cd-68f5371a7e6b'; -- dr-kunal-bahrani: Neurosciences
update doctors set specialty = 'Nephrology' where id = '253ec554-f1d4-4e8c-8ae7-fdf586488917'; -- dr-salil-jain: Nephrology & Kidney Transplant
update doctors set specialty = 'Orthopaedic Care' where id = '80a9bc6f-0f37-44b7-9066-75299773009b'; -- dr-k-d-soni: Orthopaedics
update doctors set specialty = 'Urology Care' where id = 'c158ca76-dda4-41f7-a5f8-05641e70d6f9'; -- dr-anil-mandhani: Nephrology & Kidney Transplant
update doctors set specialty = 'Urology Care' where id = 'c5f8e580-0ea2-4646-be54-1f906bd88052'; -- dr-pradeep-kumar-bansal: Nephrology & Kidney Transplant
update doctors set specialty = 'Urology Care' where id = 'c7f62daf-53b5-473b-a2e7-e1eb4795f94f'; -- dr-shafiq-ahmed: Nephrology & Kidney Transplant
update doctors set specialty = 'Neurosurgery' where id = 'aa8fc6d7-723a-4943-96f9-f47e7534a7ec'; -- dr-sandeep-vaishya: Neuro and Spine Surgery
update doctors set specialty = 'Neurosurgery' where id = '7cb81fd1-0690-431a-96f7-e34299dc918c'; -- dr-vijay-kant-dixit: Neuro and Spine Surgery
update doctors set specialty = 'Neurosurgery' where id = 'f6723cf9-2218-4fe9-9b8e-9b17303da787'; -- dr-harnarayan-singh: Neuro and Spine Surgery
update doctors set specialty = 'Neurosurgery' where id = '5fedf639-66c2-4c41-8398-763e02d219ac'; -- dr-sudhir-dubey: Neuro and Spine Surgery
update doctors set specialty = 'Pediatric Care' where id = 'e0455513-f74f-4325-bb10-d9580bb81fd5'; -- dr-anand-sinha: Paediatric Care
update doctors set specialty = 'Orthopaedic Care' where id = '2c383331-61c4-4587-b5ae-b6b6189e7064'; -- dr-manoj-miglani: Orthopaedics
update doctors set specialty = 'Urology Care' where id = '3367da47-cb0e-49b0-b62d-ab72c9b3fe09'; -- dr-sanjeev-gulati: Kidney & Urology
update doctors set specialty = 'Oncology Care' where id = '23f56a44-852b-4c55-abce-2acc52f48ba7'; -- dr-nitesh-rohatgi: Oncology (Fortis Cancer Institute)
update doctors set specialty = 'Urology Care' where id = '786d7cf3-017f-41f7-bbe5-f44f7aaad219'; -- dr-anil-gulia: Kidney & Urology
update doctors set specialty = 'Gastroenterology' where id = '40585cbf-9516-4738-9a97-b0545eb4ca1b'; -- dr-amit-javed: Gastro Sciences
update doctors set specialty = 'Oncology Care' where id = 'a874656c-f958-4d7c-abd9-d69caa88cb1d'; -- dr-anusheel-munshi: Radiation Oncology
update doctors set specialty = 'Urology Care' where id = 'f3ba5113-717e-41bf-919e-7d06ad87159c'; -- dr-anant-kumar: Nephrology & Kidney Transplant
update doctors set specialty = 'Nephrology' where id = '0f093eb4-7854-46bd-8a34-97aa94187431'; -- dr-gagan-deep-chhabra: Nephrology & Kidney Transplant
update doctors set specialty = 'Urology Care' where id = '858b2e37-ad58-4b92-bb2a-97e91b87d1c3'; -- dr-sanjay-gogoi: Nephrology & Kidney Transplant
update doctors set specialty = 'Nephrology' where id = 'ece3a849-887a-4666-bd7e-df2b94d25cab'; -- dr-saurabh-pokhriyal: Nephrology & Kidney Transplant
update doctors set specialty = 'Neurosurgery' where id = 'f25167ce-e518-4930-a80f-f86793a9d59f'; -- dr-aditya-gupta: Neuro and Spine Surgery
update doctors set specialty = 'Neurosurgery' where id = '55336aec-9152-4c7f-819e-7400c98a0c78'; -- dr-rana-patir: Neuro and Spine Surgery
update doctors set specialty = 'Neurosurgery' where id = '63c78f1a-6015-4470-8bc3-ff39db495abd'; -- dr-rohit-bansil: Neuro and Spine Surgery
update doctors set specialty = 'Neurosurgery' where id = 'd793ad60-ba63-46b7-84b4-7fcce205fae4'; -- dr-tariq-matin: Neuro and Spine Surgery
update doctors set specialty = 'Oncology Care' where id = 'fb5e51c1-b4c5-475e-b916-bc8131405d31'; -- dr-sabhyata-gupta: Gynaecology
update doctors set specialty = 'Neurosurgery' where id = 'd43e9eb4-a653-47b4-a717-6f4a0d77233d'; -- dr-kamal-verma: Neurosciences / Neurosurgery
update doctors set specialty = 'Cardiac Care' where id = '3fd84eac-a57a-42c4-8a13-85589f1fc762'; -- dr-sanjay-kumar: Cardiac Sciences
update doctors set specialty = 'Oncology Care' where id = '2c46ba11-fce3-41c3-98f2-606771a65a38'; -- dr-rakesh-ojha: Oncology
update doctors set specialty = 'Orthopaedic Care' where id = '33b760a6-b323-4e2c-83d7-dd42329448a6'; -- dr-amite-pankaj-aggarwal: Orthopaedics
update doctors set specialty = 'Nephrology' where id = '46060632-18ec-47a2-9ee8-ed32612a4ee1'; -- dr-deepak-kalra: Kidney Transplant / Nephrology
update doctors set specialty = 'Urology Care' where id = '740b9893-97d4-412f-b3eb-b618091f2830'; -- dr-abhiyutthan-singh-jadaon: Renal Transplant & Urology
update doctors set specialty = 'Cardiac Care' where id = 'a588b5a6-6246-402a-80b6-8c1da35ad774'; -- dr-anil-dhall: Cardiology & Interventional Cardiology
update doctors set specialty = 'Neurosurgery' where id = 'ae2c6eea-7e50-46fb-a65a-f398207c1d33'; -- dr-atul-prasad: Neurosciences
update doctors set specialty = 'Orthopaedic Care' where id = '7b5d5c48-4340-46cf-993d-8d6694e0bf36'; -- dr-rajesh-k-verma: Orthopaedics & Trauma
update doctors set specialty = 'Neurosurgery' where id = 'e07bb678-8f2d-4d3c-bef7-fb9c45eee0c4'; -- dr-praveen-gupta: Neurology
update doctors set specialty = 'Cardiac Care' where id = 'f10bce67-3fde-4e4d-999b-e2c6788627f6'; -- dr-brig-sameer-kumar: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = '77eb0832-d7e1-4912-95ed-4f91ac9e7960'; -- dr-yogendra-singh-rajput: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = '2f2d5cd4-e46c-48a4-ab77-d5791bf91b1e'; -- dr-amit-pendharkar: Cardiology & Cardiac Surgery
update doctors set specialty = 'Neurosurgery' where id = 'd3c9064d-5f20-41c5-a543-aac289d55f63'; -- dr-madhukar-bhardwaj: Neurology & Neurosurgery
update doctors set specialty = 'Neurosurgery' where id = '451a1c53-d8a4-4556-b86d-7cbbd84a8fca'; -- dr-amit-srivastava: Neurology & Neurosurgery
update doctors set specialty = 'Neurosurgery' where id = 'f3d34e82-6088-4780-bbbb-5e031034885d'; -- dr-nagesh-chandra: Neurology & Neurosurgery
update doctors set specialty = 'Orthopaedic Care' where id = '80466150-914f-408e-bc4d-a90240213057'; -- dr-pankaj-bajaj: Joint Replacement
update doctors set specialty = 'Neurosurgery' where id = '9d770d16-dc98-4eb7-acf2-5c43fa6f138f'; -- dr-kadam-nagpal: Neurology
update doctors set specialty = 'Nephrology' where id = 'e50ad532-bb42-402c-a637-7e57e197a7cf'; -- dr-umesh-gupta: Renal Sciences
update doctors set specialty = 'Nephrology' where id = '1f679b63-8444-4983-b6a4-bd484dcd3cae'; -- dr-vikas-agarwal: Renal Sciences
update doctors set specialty = 'Oncology Care' where id = '4ce56fa9-5a72-4e28-9cae-006c81a6e3cb'; -- dr-parveen-jain: Oncology
update doctors set specialty = 'Oncology Care' where id = '87835f4b-4881-45e7-960b-bb681fd89287'; -- dr-arun-kumar-giri: Oncology
update doctors set specialty = 'Pediatric Care' where id = 'c8fb2ec9-c39b-4c05-80a1-773aae866604'; -- dr-shipli-ghosh-shrivastava: Mother & Child
update doctors set specialty = 'Neurosurgery' where id = '4b76af23-14f9-4c8d-b69b-5651f1fa9594'; -- dr-vinit-banga: Neurosciences / Neurosurgery
update doctors set specialty = 'Pediatric Care' where id = '0f69aa15-ce5b-4d56-8cbe-e01a34efe8fe'; -- dr-syed-mustafa-hasan: Mother & Child
update doctors set specialty = 'Orthopaedic Care' where id = '5526cfbc-aab0-44e3-9c29-b0682ab1943c'; -- dr-ashutosh-shrivastav: Orthopaedics
update doctors set specialty = 'Urology Care' where id = 'ad47b086-0672-4ffd-950f-13cc75224e02'; -- dr-anup-gulati: Urology
update doctors set specialty = 'General Surgery' where id = '1f64e750-27dd-4410-87a0-ffe325745fc0'; -- dr-amit-sehgal: Bariatric Surgery
update doctors set specialty = 'Cardiac Care' where id = 'b44b5d4f-41e2-428f-b526-07556df48b23'; -- dr-bipin-kumar-dubey: Cardiac Sciences
update doctors set specialty = 'Orthopaedic Care' where id = '1f8e5f93-c192-44d7-97ff-4e5a84654193'; -- dr-harish-ghoota: Orthopaedics
update doctors set specialty = 'Neurosurgery' where id = 'de5bfcc4-ed11-44be-bcda-352656f50ab3'; -- dr-sanjay-kumar-chaudhary: Neurology
update doctors set specialty = 'Orthopaedic Care' where id = 'd7b0a3da-efd1-43c3-b1e2-561315ae210c'; -- dr-pradeep-sharma-isic: Orthopaedics
update doctors set specialty = 'Cardiac Care' where id = '36311a1b-9ac0-41e3-8def-3d7a2ac0c429'; -- dr-ashish-agarwal: Cardiology & Cardiac Surgery
update doctors set specialty = 'Nephrology' where id = '6739c677-7c20-4ffa-9ed2-38501bdf7d66'; -- dr-tejendra-singh-chauhan: Renal Sciences / Nephrology
update doctors set specialty = 'Neurosurgery' where id = 'cba9a22f-159a-4240-8f57-6b38a4d2c5a8'; -- dr-sudhir-tyagi: Neurosciences
update doctors set specialty = 'Orthopaedic Care' where id = 'bae5f3b5-9dab-48bb-afef-d350a041be3a'; -- dr-rajeev-verma: Orthopaedics & Joint Replacement
update doctors set specialty = 'Cardiac Care' where id = 'a3bbf5e5-9a71-4f0c-bb81-c6707bd55c0d'; -- dr-khushwant-popli: Cardiology & Cardiac Surgery
update doctors set specialty = 'Cardiac Care' where id = 'bca0a9db-33bd-4550-a1ef-13bb369a8477'; -- dr-rishi-gupta: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = 'af25ca20-4063-4af1-bc22-0fa1b2969373'; -- dr-subrat-akhoury: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = 'a7d0f686-163f-4c5e-8182-b01dcf2d85b8'; -- dr-simmi-manocha: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = '7de928fa-50fa-4f86-a6af-b56501efa8fd'; -- dr-amit-chaudhary: Cardiac Sciences
update doctors set specialty = 'Neurosurgery' where id = '27d58094-a442-4bd5-9ca7-8470f1f430d0'; -- dr-mukesh-pandey: Neurosciences
update doctors set specialty = 'Neurosurgery' where id = 'd775efe2-9253-4a88-b041-d0a745ffca17'; -- dr-sumit-singh: Neurosciences
update doctors set specialty = 'Oncology Care' where id = '5152bcde-d486-4e48-a044-4a880d79393e'; -- dr-durgatosh-pandey: Oncology
update doctors set specialty = 'Neurosurgery' where id = '55509bc3-ba17-438c-9ecf-58e697218eb6'; -- dr-rahul-gupta-neuro: Neurosciences & Stroke
update doctors set specialty = 'Orthopaedic Care' where id = 'a59ce448-3f5c-4524-b227-d475d26316c9'; -- dr-atul-mishra: Orthopaedics
update doctors set specialty = 'Orthopaedic Care' where id = 'f4d7d3c4-85bf-4db8-8753-6a540de06843'; -- dr-raju-vaishya: Orthopaedics
update doctors set specialty = 'Cardiac Care' where id = '399dd26b-7dd6-45fc-9950-ce1c6e6059af'; -- dr-viveka-kumar: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = 'dcf3d90f-0ca6-457b-8572-9392a0a4349b'; -- dr-arvind-kumar-goyal: Cardiac Sciences
update doctors set specialty = 'Cardiac Care' where id = '1d13e361-eb50-49cd-a5fb-848f09a7b75c'; -- dr-sameer-shrivastava: Cardiac Sciences
update doctors set specialty = 'Neurosurgery' where id = '71d72640-aa14-4c2d-98c0-20cd2de6eb01'; -- dr-joy-dev-mukherji: Neurosciences
update doctors set specialty = 'Oncology Care' where id = '760cfddf-bef5-4d91-8579-0ff6c67c60aa'; -- dr-sangram-keshari-sahoo: Oncology
update doctors set specialty = 'Oncology Care' where id = 'be698baf-8a50-4a45-a96d-7a4363b30392'; -- dr-shubham-garg: Oncology
update doctors set specialty = 'Liver Transplant' where id = '356a1e43-c4e7-4e8d-a980-54a1f51ea222'; -- dr-neerav-goyal: Organ Transplants
update doctors set specialty = 'Oncology Care' where id = 'b4973382-3425-467f-ac15-30a7bcfa0099'; -- dr-rayaz-ahmed: Oncology & Haematology
update doctors set specialty = 'Oncology Care' where id = '1b9865d0-a9a2-47e7-91f8-26dbe82c1d9d'; -- dr-vibhor-sharma: Oncology
update doctors set specialty = 'Orthopaedic Care' where id = 'a5f8d4ed-93d3-4d0c-8170-202d125830ef'; -- dr-ramkinkar-jha: Orthopaedics & Joint Replacement
update doctors set specialty = 'Orthopaedic Care' where id = 'cb06bb80-5667-48cb-93a7-504e87690b86'; -- dr-debashish-chanda: Orthopaedics & Joint Replacement
update doctors set specialty = 'Oncology Care' where id = '644fa2d2-0e99-44b1-a603-349993f264ab'; -- dr-rohan-khandelwal: Surgical Sciences / Oncology
update doctors set specialty = 'Cardiac Care' where id = '5df6d17d-c117-4f9e-9161-081f69dcf23d'; -- dr-subhash-chandra: Cardiac Sciences
update doctors set specialty = 'Oncology Care' where id = 'bf0503b6-1205-418c-98dc-470533dab39d'; -- dr-mayank-madan: Surgical Sciences / Oncology
update doctors set specialty = 'Cardiac Care' where id = 'd1ff8f34-f49f-4e25-ba8c-385811deb540'; -- dr-kamal-k-sethi: Cardiology & Interventional Cardiology
update doctors set specialty = 'Cardiac Care' where id = 'dff0b979-5d7e-4695-a56e-92014e7d805a'; -- dr-rahul-mehrotra: Cardiology & Cardiac Surgery
update doctors set specialty = 'Cardiac Care' where id = '153f3c90-520c-44da-8ccc-979552aa9b86'; -- dr-balbir-kalra: Cardiology & Cardiac Surgery
update doctors set specialty = 'Cardiac Care' where id = 'e8d84905-1082-429f-adee-5204b939bc64'; -- dr-amit-kumar-chaurasia: Cardiology & Cardiac Surgery
update doctors set specialty = 'Cardiac Care' where id = 'a194809d-cb92-4e75-a379-e981f2da7b3c'; -- dr-nidhi-rawal: Cardiology & Cardiac Surgery
update doctors set specialty = 'Cardiac Care' where id = '38567c71-54cf-4c5e-b4d2-d5f31ef168e0'; -- dr-aseem-ranjan-srivastava: Cardiology & Cardiac Surgery
update doctors set specialty = 'Oncology Care' where id = 'a0a0b0bc-4c75-402d-9c43-8f4d844971df'; -- dr-rahul-naithani: Oncology
update doctors set specialty = 'Urology Care' where id = '0690e7bf-303a-4da8-8a8d-b04a2b5d13c5'; -- dr-s-v-kotwal: Urology
update doctors set specialty = 'Liver Transplant' where id = '1bb72aa3-63b5-444f-835f-402edec6c773'; -- dr-subhash-gupta: Organ Transplants
update doctors set specialty = 'Oncology Care' where id = '420ddfc4-9c9e-4891-9b0e-e91a3f2aa9f8'; -- dr-subodh-chandra-pande: Oncology
update doctors set specialty = 'Neurosurgery' where id = 'd749185c-fd40-44db-b9af-42db418f0c23'; -- dr-vipul-gupta: Neurosciences
update doctors set specialty = 'Urology Care' where id = '67e7744f-96bc-4b04-a4bd-035ee868bc1c'; -- dr-rajiv-yadav: Urology
update doctors set specialty = 'Neurosurgery' where id = 'f0661c75-5ffa-48d8-b82e-36236b2a0d95'; -- dr-jaideep-bansal: Neurosciences
update doctors set specialty = 'Oncology Care' where id = 'ae7f2ec2-b328-4879-9b7d-3f221721d31f'; -- dr-sameer-kaul: Oncology
update doctors set specialty = 'Oncology Care' where id = 'f7a50224-2aa9-45c6-a8e8-d06ef1722677'; -- dr-chandragouda-dodagoudar: Oncology & BMT
update doctors set specialty = 'Oncology Care' where id = '88a365b3-44b6-4ed8-a7bd-a6e0d418133a'; -- dr-s-hukku: Oncology & BMT
update doctors set specialty = 'Oncology Care' where id = '63b57d98-be9e-48f5-99f9-a6bbcd3bec5a'; -- dr-shikha-halder: Oncology & BMT
update doctors set specialty = 'Cardiac Care' where id = '87832e64-1d64-42ad-b43a-564dd730e711'; -- dr-t-s-kler: Cardiac Sciences
update doctors set specialty = 'Orthopaedic Care' where id = '8a397718-caac-457b-ad5d-0eff8f58636d'; -- dr-bhushan-nariani: Orthopaedics
update doctors set specialty = 'Oncology Care' where id = '9b0ac7ca-3bd1-4391-b232-85cd3bbee0b8'; -- dr-pradeep-kumar-jain: Oncology
update doctors set specialty = 'Neurosurgery' where id = '1603239a-b649-4cce-917c-2c2ed90c96f3'; -- dr-anil-kumar-kansal: Neurosciences
update doctors set specialty = 'Cardiac Care' where id = '90d1e142-8ee5-4b70-9f75-f011d736ee32'; -- dr-nityanand-tripathi: Cardiac Sciences
update doctors set specialty = 'Gastroenterology' where id = '3efc0c9c-795d-49ca-b514-58651b62ba57'; -- dr-shiv-kumar-sarin: Hepatology
update doctors set specialty = 'Cardiac Care' where id = '13b8f839-eea4-49b8-aba9-7b36804a8108'; -- dr-yugal-k-mishra: Cardiac Sciences
update doctors set specialty = 'Orthopaedic Care' where id = 'adff1a03-2b77-4630-a99e-f17241924bd7'; -- dr-deepak-chaudhary: Orthopaedics
update doctors set specialty = 'Cardiac Care' where id = 'd6eb75e8-7f7a-46e3-94f9-fa98199d3a8e'; -- dr-tapan-ghose: Cardiac Sciences
update doctors set specialty = 'Liver Transplant' where id = '0195304a-e58e-4c61-b7c9-eb26abd88d03'; -- dr-viniyendra-pamecha: HPB Surgery & Liver Transplantation
