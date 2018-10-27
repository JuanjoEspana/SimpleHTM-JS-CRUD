'use strict'

let characters = [];
let selectedChar;

function addOrUpdate(){
	console.log("Add or update");
	var name = $("#nameInput").val();
	var age = $("#ageInput").val();
	
	var race = $("#raceInput").val();
	var language = $("#languageInput").val();
	
	if(_.isEmpty(name) || _.isEmpty(age) 
		|| _.isEmpty(race) || _.isEmpty(language)){
		alert("Missing mandatory field");
	} else {
		console.log("Name: " + name +" and age: " + age);
		
		var character = _.find(characters, 
			function(charElement){ 
				return charElement.name===name; 
			});
			
		if(character === undefined){
			var newChar = {
				name: name,
				age: age,
				race: {
					race: race,
					language: language
				},
				skills: []
			}
			newChar.skills.push( $("#skillInput").val() );
			
			console.log(newChar);			
			characters.push(newChar);
		} else {
			var index = characters.indexOf(character);
			character.name = name;
			character.age = age;
			character.race.race = race;
			character.race.language = language;
			
			var skillsField = $("#skillInput").val();
			character.skills = [];
			if(skillsField.includes(",")){
				character.skills = skillsField.split(",");
			} else if( !_.isEmpty(skillsField) ){				
				character.skills.push(skillsField);
			} 			
			
			characters[index] = character;
		}
		
		refreshTable(characters);
	}	
}

function cleanInputs(){
	$("#nameInput").val("");
	$("#ageInput").val("");

	$("#raceInput").val("");
	$("#languageInput").val("");
	
	$("#skillInput").val("");
}

function addOrUpdateSkill(){
	var nameInputTxt = $("#nameInput").val();
	var skill = $("#skillInput").val();
	
	if(nameInputTxt === undefined){
		alert("Please, select a character to grant him/her skill(s).");
	} else {	
		var character = _.find(characters, 
			function(charElement){ 
				return charElement.name===nameInputTxt; 
			});

		if(character === undefined){
			alert("Character to grant skill was not found!");
		} else{
			console.log("Character found");
			
			character.skills.push(skill);
			refreshTable(characters);
		}
	}
}

function refreshTable(list){
	$("#charTable tbody tr").remove(); 
	
	_.each(list, function(character){
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var txt = document.createTextNode(character.name);
		td.appendChild(txt);
		tr.appendChild(td);
		
		td = document.createElement("td");
		txt = document.createTextNode(character.age);
		td.appendChild(txt);
		tr.appendChild(td);
		
		td = document.createElement("td");
		txt = document.createTextNode(character.race.race);
		td.appendChild(txt);
		tr.appendChild(td);
		
		td = document.createElement("td");
		txt = document.createTextNode(character.race.language);
		td.appendChild(txt);
		tr.appendChild(td);
		
		td = document.createElement("td");
		txt = document.createTextNode(character.skills);
		td.appendChild(txt);
		tr.appendChild(td);
		
		$("#charTable > tbody:last-child").append(tr);
		
		$("#charTable tr").click(function(){
		   $(this).addClass('selected').siblings().removeClass('selected');    
		   var value=$(this).find('td:first').html();
		   selectedChar = value;
		   loadSelectedChar();
		});
		
		td = document.createElement("td");
		var delButton = document.createElement("input");
		    
		delButton.type = "button";
		delButton.value = "Delete";
		delButton.onclick = function(character){
			var index = characters.indexOf(character);
			characters.splice(index, 1);
			refreshTable(characters);
		};
		td.appendChild(delButton);
		tr.appendChild(td);
		
		cleanInputs();
	});
}

function loadSelectedChar(){
	var character = _.find(characters, 
	function(charElement){ 
		return charElement.name===selectedChar; 
	});
	
	if(character !== undefined){
				$("#nameInput").val(character.name);
		$("#ageInput").val(character.age);
	
		$("#raceInput").val(character.race.race);
		$("#languageInput").val(character.race.language);
		
		$("#skillInput").val(character.skills.toString());
	}
}

function search(){
	var searchFieldVal = $("#searchInput").val();	
	if(_.isEmpty(searchFieldVal)){
		refreshTable(characters);
	} else {	
		var filteredList = _.filter(characters, function(character){
				return character.name.includes(searchFieldVal) 
					|| character.age.includes(searchFieldVal)
					|| character.race.race.includes(searchFieldVal)
					|| character.race.language.includes(searchFieldVal)
					|| character.skills.toString().includes(searchFieldVal);
			}
		);	
		
		refreshTable(filteredList);
	}	
}