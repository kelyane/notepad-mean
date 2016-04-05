(function() {
 
  var app = angular.module('notepadJS', []);
  
  app.controller("NotepadController", function($scope){
        'use strict';
        
        $scope.notes = [];
        $scope.currentNote = {};
        
        Parse.initialize("notepadId", "notepadIdJS");
        Parse.serverURL = 'https://notepad-mean.herokuapp.com/parse'
        var Note = Parse.Object.extend("Note");

        $scope.addNewNote = function(){
          $scope.currentNote = {};
          document.getElementById("currentNote").focus();
        }
        
        var myNote = function(note){
          return {id: note.id, text: note.get("note")};
        }
        
        $scope.listNotes = function(){
          var query = new Parse.Query("Note");
          query.find({
            success: function(data) { 
             
              $scope.notes = data.map(function(value) {
                return myNote(value);
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
                    $scope.currentNote = myNote(newNote);
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
            success: function(note) { 
              $scope.currentNote = myNote(note);
              $scope.$apply();

            },
            error: function(object, error) {
              console.log(error);
            }
          })
        }
        
        $scope.delete = function(){
           var query = new Parse.Query("Note");
            query.get($scope.currentNote.id,{
              success : function(note){
                note.destroy({
                  success: function(note) {
                    $scope.listNotes();
                    $scope.currentNote = {};
                  },
                  error: function(note, error) {
                    console.log(error);
                  }
                });
              },
              error: function(newNote, error) {
                console.log(error);
              }
            });
        }
        
        $scope.listNotes();
  }); 
 
})(); 
