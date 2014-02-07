var autoFillControllers=angular.module('autoFillControllers',[]);

autoFillControllers.controller('AutoFill',function($scope,$firebase){

	var fb = new Firebase("https://landed.firebaseio.com/places");

	$scope.countries = $firebase( fb );


	$scope.suggest='';
	$scope.matches=[];

	$scope.countries.$bind($scope, "SYNC");

    /*var countries = new Firebase("https://landed.firebaseio.com/places/");
   	var pushRef = countries.push();// this allows us to remove a specific one by ref later like pushRef.remove();
   	pushRef.set({'name':'Lincoln'}); // or directly use push() !
   	*/

	$scope.addPlace= function(pl,type){

		fb.once('value', function(snap) { 

   			if( snap.val() === null ) {}
   				else{
   					
   					var keys = $scope.SYNC.$getIndex();
   					var dupes=false;

   						keys.forEach(function(key, i) {
						 	
						 	//console.log("comparing "+$scope.countries[key]['placeName'] +" to "+pl); // prints items in order they appear in Firebase
							
							if($scope.countries[key]['placeName'] == pl){
								console.log('trying to submit duplicate for '+ pl);
								dupes=true;
							}
						 });

   						if(!dupes) $scope.countries.$add( {'placeName':pl} );
   				}
		});
	}


	$scope.changeField = function(str){
//return false;
		//string changes length each time this function runs and it can get smaller !
		var aMatches=[];
		//console.log("new letter "+str+" .. "+aMatches.toString());
		if(str){
			str = angular.lowercase(str); //using angular lowercase could use plain javascript too.
			var newStringLength = str.length; //need to loop through this length times..

				fb.once('value',function(placeSnapshot){ // we cant have this being called each interaction for each character loop for sure..!
					
					for (var i=0; i<newStringLength;i++){
						//console.log("index is "+ i +" character at " + str.charAt(i));

						placeSnapshot.forEach(function(leSnapshot) {
				//console.log(leSnapshot.val());
	  								var name = leSnapshot.child('placeName').val();//eg Lisbon then L.A. then New York (for each place already in the firebase)
									name=angular.lowercase(name);//aNames.push(name);
									//console.log(name);
						  			//if(str.indexOf(name.charAt(i))!= -1)
						  			//console.log("checking "+str.charAt(i)+" against "+name.charAt(i));
						  			//if(str.charAt(i) == name.charAt(i))// this was one of the bigger errors for achieving this as it subsequently forgets the preceding characters
						  			if(str == name.substr(0, str.length) )
						  			{	

						  				aMatches.push(name);
						  			}

					  				//performance suggestion start matching after 3-4 characters..
					  				//try matching using regex on say first 3 characters then next 3 etc... so (matches regex1 && matches regex2) then..

					
									});
					}
					//show final matches...
					$scope.matches=[];
					$scope.matches=_.uniq(aMatches,false);
					//console.log($scope.matches);

				});
		}

	};


});