var autoFillControllers=angular.module('autoFillControllers',[]);

autoFillControllers.controller('AutoFill',function($scope,$firebase){

	$scope.countries = new Firebase("https://landed.firebaseio.com/places/");
	$scope.suggest='';
	$scope.matches=[];

    /*var countries = new Firebase("https://landed.firebaseio.com/places/");
   	var pushRef = countries.push();// this allows us to remove a specific one by ref later like pushRef.remove();
   	pushRef.set({'name':'Lincoln'}); // or directly use push() !
   	*/

   $scope.addPlace= function(pl,type){
   	console.log('addPlace called '+pl + $scope.place+ type);
   	var BreakException= {};
   	if(pl && !type){
   		
   		//need to check for existing entry in case the user just hits enter or other way.
			$scope.countries.once('value',function(placeSnapshot){

			try{

				placeSnapshot.forEach(function(leSnapshot) {
					var name = leSnapshot.child('name/').val();
					name=angular.lowercase(name);
					if(name == pl){
						console.log('trying to submit duplicate for '+ pl);
						throw BreakException;
						
					}else{
						console.log(pl+ 'not currently in database');
						$scope.countries.push({'name':pl});
						throw BreakException;
					}
				});

			}catch(e){
				if (e!==BreakException) throw e;
			};

			});
   		
   		
   	}
   	else{
   		//we are suggesting so just populate the value in the input
   		//console.log('from the click on field '+$scope.suggest);
   		$scope.needed=pl;
   		//$scope.matches=[];

   	}
   }


	$scope.changeField = function(str){

		//string changes length each time this function runs and it can get smaller !
		var aMatches=[];
		//console.log("new letter "+str+" .. "+aMatches.toString());
		if(str){
			str = angular.lowercase(str); //using angular lowercase could use plain javascript too.
			var newStringLength = str.length; //need to loop through this length times..

				$scope.countries.once('value',function(placeSnapshot){ // we cant have this being called each interaction for each character loop for sure..!
					
					for (var i=0; i<newStringLength;i++){
						//console.log("index is "+ i +" character at " + str.charAt(i));

						placeSnapshot.forEach(function(leSnapshot) {
				
	  								var name = leSnapshot.child('name/').val();//eg Lisbon then L.A. then New York (for each place already in the firebase)
									name=angular.lowercase(name);//aNames.push(name);
									//console.log(i);
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
					console.log($scope.matches);

				});
		}

	};




});