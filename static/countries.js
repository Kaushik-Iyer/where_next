const countries = [
    { name: "Afghanistan", capital: "Kabul", continent: "Asia" },
    { name: "Aland Islands", capital: "Mariehamn", continent: "Europe" },
    { name: "Albania", capital: "Tirana", continent: "Europe" },
    { name: "Algeria", capital: "Algiers", continent: "Africa" },
    { name: "American Samoa", capital: "Pago Pago", continent: "Oceania" },
    { name: "Andorra", capital: "Andorra la Vella", continent: "Europe" },
    { name: "Angola", capital: "Luanda", continent: "Africa" },
    { name: "Anguilla", capital: "The Valley", continent: "North America" },
    { name: "Antarctica", capital: null, continent: "Antarctica" },
    { name: "Antigua and Barbuda", capital: "Saint John's", continent: "North America" },
    { name: "Argentina", capital: "Buenos Aires", continent: "South America" },
    { name: "Armenia", capital: "Yerevan", continent: "Asia" },
    { name: "Aruba", capital: "Oranjestad", continent: "North America" },
    { name: "Australia", capital: "Canberra", continent: "Oceania" },
    { name: "Austria", capital: "Vienna", continent: "Europe" },
    { name: "Azerbaijan", capital: "Baku", continent: "Asia" },
    { name: "Bahrain", capital: "Manama", continent: "Asia" },
    { name: "Bangladesh", capital: "Dhaka", continent: "Asia" },
    { name: "Barbados", capital: "Bridgetown", continent: "North America" },
    { name: "Belarus", capital: "Minsk", continent: "Europe" },
    { name: "Belgium", capital: "Brussels", continent: "Europe" },
    { name: "Belize", capital: "Belmopan", continent: "North America" },
    { name: "Benin", capital: "Porto-Novo", continent: "Africa" },
    { name: "Bermuda", capital: "Hamilton", continent: "North America" },
    { name: "Bhutan", capital: "Thimphu", continent: "Asia" },
    { name: "Bolivia", capital: "Sucre", continent: "South America" },
    { name: "Bosnia and Herzegovina", capital: "Sarajevo", continent: "Europe" },
    { name: "Botswana", capital: "Gaborone", continent: "Africa" },
    { name: "Brazil", capital: "Brasília", continent: "South America" },
    { name: "British Indian Ocean Territory", capital: null, continent: "Asia" },
    { name: "Brunei", capital: "Bandar Seri Begawan", continent: "Asia" },
    { name: "Bulgaria", capital: "Sofia", continent: "Europe" },
    { name: "Burkina Faso", capital: "Ouagadougou", continent: "Africa" },
    { name: "Burundi", capital: "Gitega", continent: "Africa" },
    { name: "Cambodia", capital: "Phnom Penh", continent: "Asia" },
    { name: "Cameroon", capital: "Yaoundé", continent: "Africa" },
    { name: "Canada", capital: "Ottawa", continent: "North America" },
    { name: "Cape Verde", capital: "Praia", continent: "Africa" },
    { name: "Cayman Islands", capital: "George Town", continent: "North America" },
    { name: "Central African Republic", capital: "Bangui", continent: "Africa" },
    { name: "Chad", capital: "N'Djamena", continent: "Africa" },
    { name: "Chile", capital: "Santiago", continent: "South America" },
    { name: "China", capital: "Beijing", continent: "Asia" },
    { name: "Christmas Island", capital: null, continent: "Oceania" },
    { name: "Cocos (Keeling) Islands", capital: "West Island", continent: "Oceania" },
    { name: "Colombia", capital: "Bogotá", continent: "South America" },
    { name: "Comoros", capital: "Moroni", continent: "Africa" },
    { name: "Congo", capital: "Brazzaville", continent: "Africa" },
    { name: "Democratic Republic of the Congo", capital: "Kinshasa", continent: "Africa" },
    { name: "Cook Islands", capital: "Avarua", continent: "Oceania" },
    { name: "Costa Rica", capital: "San José", continent: "North America" },
    { name: "Croatia", capital: "Zagreb", continent: "Europe" },
    { name: "Cuba", capital: "Havana", continent: "North America" },
    { name: "Curacao", capital: "Willemstad", continent: "North America" },
    { name: "Cyprus", capital: "Nicosia", continent: "Europe" },
    { name: "Czech Republic", capital: "Prague", continent: "Europe" },
    { name: "Denmark", capital: "Copenhagen", continent: "Europe" },
    { name: "Djibouti", capital: "Djibouti", continent: "Africa" },
    { name: "Dominica", capital: "Roseau", continent: "North America" },
    { name: "Dominican Republic", capital: "Santo Domingo", continent: "North America" },
    { name: "Ecuador", capital: "Quito", continent: "South America" },
    { name: "Egypt", capital: "Cairo", continent: "Africa" },
    { name: "El Salvador", capital: "San Salvador", continent: "North America" },
    { name: "Equatorial Guinea", capital: "Malabo", continent: "Africa" },
    { name: "Eritrea", capital: "Asmara", continent: "Africa" },
    { name: "Estonia", capital: "Tallinn", continent: "Europe" },
    { name: "Ethiopia", capital: "Addis Ababa", continent: "Africa" },
    { name: "Falkland Islands", capital: "Stanley", continent: "South America" },
    { name: "Faroe Islands", capital: "Tórshavn", continent: "Europe" },
    { name: "Fiji", capital: "Suva", continent: "Oceania" },
    { name: "Finland", capital: "Helsinki", continent: "Europe" },
    { name: "France", capital: "Paris", continent: "Europe" },
    { name: "French Guiana", capital: "Cayenne", continent: "South America" },
    { name: "French Polynesia", capital: "Papeete", continent: "Oceania" },
    { name: "Gabon", capital: "Libreville", continent: "Africa" },
    { name: "Gambia", capital: "Banjul", continent: "Africa" },
    { name: "Georgia", capital: "Tbilisi", continent: "Asia" },
    { name: "Germany", capital: "Berlin", continent: "Europe" },
    { name: "Ghana", capital: "Accra", continent: "Africa" },
    { name: "Gibraltar", capital: "Gibraltar", continent: "Europe" },
    { name: "Greece", capital: "Athens", continent: "Europe" },
    { name: "Greenland", capital: "Nuuk", continent: "North America" },
    { name: "Grenada", capital: "Saint George's", continent: "North America" },
    { name: "Guadeloupe", capital: "Basse-Terre", continent: "North America" },
    { name: "Guam", capital: "Hagåtña", continent: "Oceania" },
    { name: "Guatemala", capital: "Guatemala City", continent: "North America" },
    { name: "Guernsey", capital: "St. Peter Port", continent: "Europe" },
    { name: "Guinea", capital: "Conakry", continent: "Africa" },
    { name: "Guinea-Bissau", capital: "Bissau", continent: "Africa" },
    { name: "Guyana", capital: "Georgetown", continent: "South America" },
    { name: "Haiti", capital: "Port-au-Prince", continent: "North America" },
    { name: "Honduras", capital: "Tegucigalpa", continent: "North America" },
    { name: "Hong Kong", capital: "Victoria", continent: "Asia" },
    { name: "Hungary", capital: "Budapest", continent: "Europe" },
    { name: "Iceland", capital: "Reykjavik", continent: "Europe" },
    { name: "India", capital: "New Delhi", continent: "Asia" },
    { name: "Indonesia", capital: "Jakarta", continent: "Asia" },
    { name: "Iran", capital: "Tehran", continent: "Asia" },
    { name: "Iraq", capital: "Baghdad", continent: "Asia" },
    { name: "Ireland", capital: "Dublin", continent: "Europe" },
    { name: "Isle of Man", capital: "Douglas", continent: "Europe" },
    { name: "Israel", capital: "Jerusalem", continent: "Asia" },
    { name: "Italy", capital: "Rome", continent: "Europe" },
    { name: "Jamaica", capital: "Kingston", continent: "North America" },
    { name: "Japan", capital: "Tokyo", continent: "Asia" },
    { name: "Jersey", capital: "Saint Helier", continent: "Europe" },
    { name: "Jordan", capital: "Amman", continent: "Asia" },
    { name: "Kazakhstan", capital: "Nur-Sultan", continent: "Asia" },
    { name: "Kenya", capital: "Nairobi", continent: "Africa" },
    { name: "Kiribati", capital: "Tarawa", continent: "Oceania" },
    { name: "Kuwait", capital: "Kuwait City", continent: "Asia" },
    { name: "Kyrgyzstan", capital: "Bishkek", continent: "Asia" },
    { name: "Laos", capital: "Vientiane", continent: "Asia" },
    { name: "Latvia", capital: "Riga", continent: "Europe" },
    { name: "Lebanon", capital: "Beirut", continent: "Asia" },
    { name: "Lesotho", capital: "Maseru", continent: "Africa" },
    { name: "Liberia", capital: "Monrovia", continent: "Africa" },
    { name: "Libya", capital: "Tripoli", continent: "Africa" },
    { name: "Liechtenstein", capital: "Vaduz", continent: "Europe" },
    { name: "Lithuania", capital: "Vilnius", continent: "Europe" },
    { name: "Luxembourg", capital: "Luxembourg", continent: "Europe" },
    { name: "Macao", capital: "Macao", continent: "Asia" },
    { name: "Macedonia", capital: "Skopje", continent: "Europe" },
    { name: "Madagascar", capital: "Antananarivo", continent: "Africa" },
    { name: "Malawi", capital: "Lilongwe", continent: "Africa" },
    { name: "Malaysia", capital: "Kuala Lumpur", continent: "Asia" },
    { name: "Maldives", capital: "Malé", continent: "Asia" },
    { name: "Mali", capital: "Bamako", continent: "Africa" },
    { name: "Malta", capital: "Valletta", continent: "Europe" },
    { name: "Marshall Islands", capital: "Majuro", continent: "Oceania" },
    { name: "Martinique", capital: "Fort-de-France", continent: "North America" },
    { name: "Mauritania", capital: "Nouakchott", continent: "Africa" },
    { name: "Mauritius", capital: "Port Louis", continent: "Africa" },
    { name: "Mayotte", capital: "Mamoudzou", continent: "Africa" },
    { name: "Mexico", capital: "Mexico City", continent: "North America" },
    { name: "Micronesia", capital: "Palikir", continent: "Oceania" },
    { name: "Moldova", capital: "Chișinău", continent: "Europe" },
    { name: "Monaco", capital: "Monaco", continent: "Europe" },
    { name: "Mongolia", capital: "Ulaanbaatar", continent: "Asia" },
    { name: "Montenegro", capital: "Podgorica", continent: "Europe" },
    { name: "Montserrat", capital: "Plymouth", continent: "North America" },
    { name: "Morocco", capital: "Rabat", continent: "Africa" },
    { name: "Mozambique", capital: "Maputo", continent: "Africa" },
    { name: "Myanmar", capital: "Naypyidaw", continent: "Asia" },
    { name: "Namibia", capital: "Windhoek", continent: "Africa" },
    { name: "Nauru", capital: "Yaren District", continent: "Oceania" },
    { name: "Nepal", capital: "Kathmandu", continent: "Asia" },
    { name: "Netherlands", capital: "Amsterdam", continent: "Europe" },
    { name: "New Caledonia", capital: "Nouméa", continent: "Oceania" },
    { name: "New Zealand", capital: "Wellington", continent: "Oceania" },
    { name: "Nicaragua", capital: "Managua", continent: "North America" },
    { name: "Niger", capital: "Niamey", continent: "Africa" },
    { name: "Nigeria", capital: "Abuja", continent: "Africa" },
    { name: "Niue", capital: "Alofi", continent: "Oceania" },
    { name: "Norfolk Island", capital: "Kingston", continent: "Oceania" },
    { name: "North Korea", capital: "Pyongyang", continent: "Asia" },
    { name: "Northern Mariana Islands", capital: "Saipan", continent: "Oceania" },
    { name: "Norway", capital: "Oslo", continent: "Europe" },
    { name: "Oman", capital: "Muscat", continent: "Asia" },
    { name: "Pakistan", capital: "Islamabad", continent: "Asia" },
    { name: "Palau", capital: "Ngerulmud", continent: "Oceania" },
    { name: "Palestine", capital: "Ramallah", continent: "Asia" },
    { name: "Panama", capital: "Panama City", continent: "North America" },
    { name: "Papua New Guinea", capital: "Port Moresby", continent: "Oceania" },
    { name: "Paraguay", capital: "Asunción", continent: "South America" },
    { name: "Peru", capital: "Lima", continent: "South America" },
    { name: "Philippines", capital: "Manila", continent: "Asia" },
    { name: "Pitcairn", capital: "Adamstown", continent: "Oceania" },
    { name: "Poland", capital: "Warsaw", continent: "Europe" },
    { name: "Portugal", capital: "Lisbon", continent: "Europe" },
    { name: "Puerto Rico", capital: "San Juan", continent: "North America" },
    { name: "Qatar", capital: "Doha", continent: "Asia" },
    { name: "Reunion", capital: "Saint-Denis", continent: "Africa" },
    { name: "Romania", capital: "Bucharest", continent: "Europe" },
    { name: "Russia", capital: "Moscow", continent: "Europe" },
    { name: "Rwanda", capital: "Kigali", continent: "Africa" },
    { name: "Saint Barthelemy", capital: "Gustavia", continent: "North America" },
    { name: "Saint Helena", capital: "Jamestown", continent: "Africa" },
    { name: "Saint Kitts and Nevis", capital: "Basseterre", continent: "North America" },
    { name: "Saint Lucia", capital: "Castries", continent: "North America" },
    { name: "Saint Martin", capital: "Marigot", continent: "North America" },
    { name: "Saint Pierre and Miquelon", capital: "Saint-Pierre", continent: "North America" },
    { name: "Saint Vincent and the Grenadines", capital: "Kingstown", continent: "North America" },
    { name: "Samoa", capital: "Apia", continent: "Oceania" },
    { name: "San Marino", capital: "San Marino", continent: "Europe" },
    { name: "Sao Tome and Principe", capital: "São Tomé", continent: "Africa" },
    { name: "Saudi Arabia", capital: "Riyadh", continent: "Asia" },
    { name: "Senegal", capital: "Dakar", continent: "Africa" },
    { name: "Serbia", capital: "Belgrade", continent: "Europe" },
    { name: "Seychelles", capital: "Victoria", continent: "Africa" },
    { name: "Sierra Leone", capital: "Freetown", continent: "Africa" },
    { name: "Singapore", capital: "Singapore", continent: "Asia" },
    { name: "Sint Maarten", capital: "Philipsburg", continent: "North America" },
    { name: "Slovakia", capital: "Bratislava", continent: "Europe" },
    { name: "Slovenia", capital: "Ljubljana", continent: "Europe" },
    { name: "Solomon Islands", capital: "Honiara", continent: "Oceania" },
    { name: "Somalia", capital: "Mogadishu", continent: "Africa" },
    { name: "South Africa", capital: "Pretoria", continent: "Africa" },
    { name: "South Georgia and the South Sandwich Islands", capital: "King Edward Point", continent: "Antarctica" },
    { name: "South Korea", capital: "Seoul", continent: "Asia" },
    { name: "South Sudan", capital: "Juba", continent: "Africa" },
    { name: "Spain", capital: "Madrid", continent: "Europe" },
    { name: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", continent: "Asia" },
    { name: "Sudan", capital: "Khartoum", continent: "Africa" },
    { name: "Suriname", capital: "Paramaribo", continent: "South America" },
    { name: "Svalbard and Jan Mayen", capital: "Longyearbyen", continent: "Europe" },
    { name: "Swaziland", capital: "Mbabane", continent: "Africa" },
    { name: "Sweden", capital: "Stockholm", continent: "Europe" },
    { name: "Switzerland", capital: "Bern", continent: "Europe" },
    { name: "Syria", capital: "Damascus", continent: "Asia" },
    { name: "Taiwan", capital: "Taipei", continent: "Asia" },
    { name: "Tajikistan", capital: "Dushanbe", continent: "Asia" },
    { name: "Tanzania", capital: "Dodoma", continent: "Africa" },
    { name: "Thailand", capital: "Bangkok", continent: "Asia" },
    { name: "Timor-Leste", capital: "Dili", continent: "Asia" },
    { name: "Togo", capital: "Lomé", continent: "Africa" },
    { name: "Tokelau", capital: "Atafu", continent: "Oceania" },
    { name: "Tonga", capital: "Nuku'alofa", continent: "Oceania" },
    { name: "Trinidad and Tobago", capital: "Port of Spain", continent: "North America" },
    { name: "Tunisia", capital: "Tunis", continent: "Africa" },
    { name: "Turkey", capital: "Ankara", continent: "Asia" },
    { name: "Turkmenistan", capital: "Ashgabat", continent: "Asia" },
    { name: "Turks and Caicos Islands", capital: "Cockburn Town", continent: "North America" },
    { name: "Tuvalu", capital: "Funafuti", continent: "Oceania" },
    { name: "Uganda", capital: "Kampala", continent: "Africa" },
    { name: "Ukraine", capital: "Kyiv", continent: "Europe" },
    { name: "United Arab Emirates", capital: "Abu Dhabi", continent: "Asia" },
    { name: "United Kingdom", capital: "London", continent: "Europe" },
    { name: "United States", capital: "Washington, D.C.", continent: "North America" },
    { name: "United States Minor Outlying Islands", capital: null, continent: "Oceania" },
    { name: "Uruguay", capital: "Montevideo", continent: "South America" },
    { name: "Uzbekistan", capital: "Tashkent", continent: "Asia" },
    { name: "Vanuatu", capital: "Port Vila", continent: "Oceania" },
    { name: "Vatican City", capital: "Vatican City", continent: "Europe" },
    { name: "Venezuela", capital: "Caracas", continent: "South America" },
    { name: "Vietnam", capital: "Hanoi", continent: "Asia" },
    { name: "Virgin Islands, British", capital: "Road Town", continent: "North America" },
    { name: "Virgin Islands, U.S.", capital: "Charlotte Amalie", continent: "North America" },
    { name: "Wallis and Futuna", capital: "Mata Utu", continent: "Oceania" },
    { name: "Western Sahara", capital: null, continent: "Africa" },
    { name: "Yemen", capital: "Sanaa", continent: "Asia" },
    { name: "Zambia", capital: "Lusaka", continent: "Africa" },
    { name: "Zimbabwe", capital: "Harare", continent: "Africa" },
]
