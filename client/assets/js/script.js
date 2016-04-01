(function() {
 
  var app = angular.module('notepadJS', []);
  
  app.controller("NotepadController", function($scope){
        'use strict';
        
        $scope.notes = [];
        $scope.currentNote = {};
        
        Parse.initialize("notepadId", "notepadIdJS");
        Parse.serverURL = 'https://notepad-mean-kelyane1.c9users.io/parse'
        var Note = Parse.Object.extend("Note");
       

        $scope.addNewNote = function(){
          $scope.currentNote = {};
          document.getElementById("currentNote").focus();
        }
        
        $scope.listNotes = function(){
          
          var query = new Parse.Query("Note");

          query.find({
            success: function(data) { 
             
              $scope.notes = data.map(function(value) {
                return { id : value.id , text : value.get("note") }
              })
              $scope.$apply();

            },
            error: function(object, error) {
              console.log(error);
            }
          })

             
        };
        
        
        $scope.submit = function(){
          
            var query = new Parse.Query("Note");
            query.get($scope.currentNote.id,{
              success : function(note){
                note.set("note", $scope.currentNote.text);
                note.save();
                $scope.listNotes();
              },
              error: function(newNote, error) {
                
                var newNote = new Note();
                newNote.set("note", $scope.currentNote.text);
                
                newNote.save(null, {
                  success: function(newNote) {
                    $scope.listNotes();
                    $scope.currentNote = {id : newNote.id, text : newNote.get("note")};
                  },
                  error: function(newNote, error) {
                    console.log(error);
                  }
                });
              }
            });
            
        };
        
        
        $scope.showNote = function(idNote){
          var query = new Parse.Query("Note");

          query.get(idNote,{
            success: function(data) { 
              $scope.currentNote = { id : idNote, text : data.get("note") };
              $scope.$apply();

            },
            error: function(object, error) {
              console.log(error);
            }
          })
        }
        
        $scope.listNotes();
  }); 
 
})(); 