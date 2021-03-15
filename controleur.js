var web3     = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

var contract_address ;
var public_key ;
var username ;
var contract ;
var nb_members;
var nb_attended_members;
var from_params;
var owner_address;

var res ;

$("#voir_diplome").click(function(){
  prompt("Entrez l'adresse du diplôme");
});

$("#authentifier_diplome").click(function(){
  prompt("Entrez l'adresse du diplôme");

  
});

$("#voir_diplome2").click(function(){

  public_key         = $("#publickey").val();
  username           = $("#username").val();
  contract_address   = $("#contract_address").val();

  web3.eth.defaultAccount = public_key;

  from_params = {from:web3.eth.defaultAccount, gas:3000000};
  contract = new web3.eth.Contract(messageABI, contract_address);

  contract.methods.addMember(username).send({from:web3.eth.defaultAccount, gas:3000000}).then(function(receipt){
      console.log(receipt);

      contract.methods.membersCount().call(from_params).then(function(result) {
       nb_members = result;
       $("#nb_members_connected").text(nb_members);
      });

      contract.methods.getAttendedMembers().call(from_params).then(function(result) {
       nb_attended_members = result;
       $("#nb_members_attended").text(nb_attended_members);
      });


      contract.methods.owner().call(from_params).then(function(owner) {

        contract.methods.getMembers().call(from_params).then(function(result) {
         //console.log(result);

         $.each(result, function( index, value ) {


             var name = value[1];
             if(value[0] == owner)
             {
                name = "👑 " + name;
             }

             if(value[0] == public_key)
             {
                name = "🔴 " + name;
             }
                var member_view = `<div class='input-group mb-3'>
                  <div class='input-group-prepend'>
                    <span class='input-group-text' id='basic-addon1'>`+name+`</span>
                  </div>
                  <input id='username' type='text' class='form-control' value='`+value[0]+`' aria-label='Username' aria-describedby='basic-addon1' disabled>
                </div>`;
            $(member_view).insertBefore( "#button_elect_representants" );
          });

          if(nb_members >= nb_attended_members)
           {
             $("#button_elect_representants").prop('disabled', false);
           }
         });

      });

  });

  $("#connexion").hide();
  $("#waiting_room").show();
});


$("#button_elect_representants").click(function(){

  contract.methods.owner().call(from_params).then(function(owner) {

          contract.methods.getMembers().call(from_params).then(function(result) {
           //console.log(result);

           $.each(result, function( index, value ) {
             var name = value[1];
             if(value[0] == owner)
             {
                name = "👑 " + name;
             }
             if(value[0] == public_key)
             {
                name = "🔴 " + name;
             }

                var member_view = `<div class='input-group mb-3'>
                                      <div class='input-group-prepend'>
                                        <span class='input-group-text' id='basic-addon1'>`+name+`</span>
                                      </div>
                                      <input id='username' type='text' class='form-control' value='`+value[0]+`' aria-label='Username' aria-describedby='basic-addon1' disabled>
                                      <div class="input-group-append">
                                        <button class="btn btn-outline-secondary bouton_vote_repr" type="button">Voter</button>
                                      </div>
                                    </div>`;
              $(member_view).insertBefore("#button_polling_space");
            });

            //console.log(nb_members, nb_attended_members);

            if(nb_members >= nb_attended_members)
             {
               $("#button_polling_space").prop('disabled', false);
             }

          });

        });

  $("#waiting_room").hide();
  $("#elect_representant").show();
});

var clicked_index;

$("#elect_representant").on('click', '.bouton_vote_repr', function() {
  clicked_index = $('#elect_representant .bouton_vote_repr').index(this);

  $("#elect_representant .bouton_vote_repr").removeClass("btn-outline-secondary");
  $("#elect_representant .bouton_vote_repr").addClass("btn-danger");

  $(this).removeClass("btn-danger");
  $(this).addClass("btn-success");
  /*$.each($("#elect_representant .bouton_vote_repr"), function( index, value ) {
     console.log(value);
   });*/

  $("#elect_representant input").prop('disabled', true);
  $("#elect_representant button").prop('disabled', false);
});

$("#button_polling_space").click(function(){

    var clicked_val   = $("#elect_representant input").eq(clicked_index).val();

    //alert(clicked_val);

    contract.methods.electPresident(clicked_val).send(from_params).then(function(result) {
      console.log(result);

      contract.methods.isMemberPresident(public_key).call(from_params).then(function(result) {
       if(result == false)
       {
        contract.methods.getResolutions().call(from_params).then(function(result) {

         $.each(result, function( index, value ) {
            var member_view = `   <div class='input-group mb-3'>
                 <input id='username' type='text' class='form-control' value='`+value[1]+`' aria-label='Username' aria-describedby='basic-addon1' disabled>
                 <div class="input-group-append">
                   <button class="btn btn-outline-success" type="button">POUR</button>
                   <button class="btn btn-secondary" type="button">NEUTRE</button>
                   <button class="btn btn-outline-danger" type="button">CONTRE</button>
                 </div>
               </div>`;
            $(member_view).insertBefore("#button_voir_resultat");
          });
        });

         $("#elect_representant").hide();
         $("#vote_resolution").show();
       }
       else {

        contract.methods.resolutionsCount().call(from_params).then(function(result){$("#resolutions_count").text(result);});
        contract.methods.attendedResolutions().call(from_params).then(function(result){$("#resolutions_attended").text(result);});

         $("#elect_representant").hide();
         $("#add_resolution").show();
       }
      });
    });

/*
    contract.methods.isMemberPresident(public_key).call(from_params).then(function(result) {
     if(result == false)
     {
       alert('pas president');
     }
     else {
       alert('president');
     }
    });

    alert($("#elect_representant input").eq(clicked_index).val());
*/
});


$("#button_vote_resolution").click(function(){

  contract.methods.getResolutions().call(from_params).then(function(result) {
   //console.log(result);

   $.each(result, function( index, value ) {
      var member_view = `<div class='input-group mb-3'>
                           <input id='username' type='text' class='form-control' value='`+value[1]+`' aria-label='Username' aria-describedby='basic-addon1' disabled>
                           <div class="input-group-append">
                             <button class="btn btn-outline-success" type="button">POUR</button>
                             <button class="btn btn-secondary" type="button">NEUTRE</button>
                             <button class="btn btn-outline-danger" type="button">CONTRE</button>
                           </div>
                         </div>`;
      $(member_view).insertBefore("#button_voir_resultat");
    });
  });

  $("#add_resolution").hide();
  $("#vote_resolution").show();
});


$("#button_add_resolution").click(function(){

  var resolution_title = $('#resolution_title').val();
  var resolution_desc  = $('#resolution_desc').val();

  contract.methods.addResolution(resolution_title, resolution_desc).send(from_params).then(function(receipt) {
   console.log(receipt)

   contract.methods.resolutionsCount().call(from_params).then(function(result){$("#resolutions_count").text(result);});
   contract.methods.attendedResolutions().call(from_params).then(function(result){$("#resolutions_attended").text(result);});
  });

});


$("#vote_resolution .input-group-append").on('click', 'button', function(){

  clicked_index = $("#vote_resolution .input-group-append button").index(this);

  clicked_line = parseInt(clicked_index / 3);
  clicked_bttn = parseInt(clicked_index % 3);

  console.log(clicked_line, clicked_bttn);

  $.each($("#vote_resolution .input-group-append:eq("+clicked_line+") button"), function( index, value ) {
     $(value).removeClass("btn-primary");
     $(value).addClass("btn-outline-primary");
   });

   $(this).addClass("btn-primary");

   vote[clicked_line] = clicked_bttn;
   console.log(vote);
});

$("#button_voir_resultat").click(function(){



  contract.methods.voteResolution(vote).send(from_params).then(function(receipt){
      console.log(receipt);

        contract.methods.getResolutions().call(from_params).then(function(result) {
         //console.log(result);

         $.each(result, function( index, value ) {
            var member_view = `<div class='input-group mb-3'>
                                 <input id='username' type='text' class='form-control' value='`+value[1]+`' aria-label='Username' aria-describedby='basic-addon1' disabled>
                                 <div class="input-group-append">
                                   <button class="btn btn-outline-success" type="button">`+value[3]+`</button>
                                   <button class="btn btn-outline-secondary" type="button">`+value[4]+`</button>
                                   <button class="btn btn-outline-danger" type="button">`+value[5]+`</button>
                                 </div>
                               </div>`;
            $(member_view).insertAfter("#top_resu_reso");
          });
        });

          $("#vote_resolution").hide();
          $("#res_resolution").show();
  });

});

/*
$("#button_nb_candidats").click(function(){
  console.log(nb_candidats);
  alert("Il y a "+nb_candidats+" candidats inscrits.");
  contract.methods.candidatesCount().call().then(function(result) {
   nb_candidats = result;
  });
});

  var candidat;
  contract.methods.candidates(1).call().then(function(result) {
   candidat = result;
  });

$("#button_afficher_candidats").click(function(){
  console.log(candidat);
  alert("Id: " + candidat['id'] + "\nNom: " + candidat['name'] + "\nNombre de votes: " + candidat['voteCount']);
});

var proprio;
contract.methods.owner().call().then(function(result) {
 proprio = result;
});

$("#button_print_proprio").click(function(){
  alert(proprio);
});
*/
