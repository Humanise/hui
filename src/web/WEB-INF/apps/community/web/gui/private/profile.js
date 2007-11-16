var controller = {
	editedId : 0,
	interfaceIsReady : function(gui) {
		N2i.log(gui);
		//In2iGui.dwrUpdate(CommunityTool.getProfileGuiData);
		var delegate = {callback:function(person) {
			givenName.setValue(person.givenName);
			familyName.setValue(person.familyName);
			namePrefix.setValue(person.namePrefix);
			nameSuffix.setValue(person.nameSuffix);
		}};
		CommunityTool.getUsersMainPerson(delegate);
	},
	searchFieldChanged : function(searchField) {
		this._search();
	},
	selectorSelectionChanged : function(selector) {
		this._search();
	},
	listRowsWasOpened : function(list) {
		var item = list.getFirstSelection();
		this.editedId = item.uid;
		if (item.kind=='person') {
			var dlgt = {
				onSuccess:function() {
					editor.hide();
					personEditor.show();
				}
			};
			In2iGui.update('LoadPerson.php?id='+item.uid,dlgt);
		} else {
			var dlgt = {
				onSuccess:function() {
					personEditor.hide();
					editor.show();
				}
			};
			In2iGui.update('LoadObject.php?id='+item.uid,dlgt);
		}
	},
	toolbarIconWasClicked$newPerson : function(icon) {
		this.editedId = null;
		editor.hide();
		personFormula.reset();
		personEditor.show();
	},
	toolbarIconWasClicked$changeToIconView : function(icon) {
		viewStack.change('iconView');
	},
	toolbarIconWasClicked$changeToListView : function(icon) {
		viewStack.change('listView');
	},
	buttonWasClicked$editorSave : function() {
		var delegate = {
			onSuccess : function() {
				editor.hide();
				list.refresh();
			}
		}
		var parms = formula.getValues();
		parms.id = this.editedId;
		var options = {method:'post',parameters:parms};
		$get('UpdateObject.php',delegate,options);
	},
	buttonWasClicked$savePerson : function() {
		var delegate = {
			callback : function() {
				alert('success');
			}
		}
		var person = {
			givenName:givenName.getValue(),
			familyName:familyName.getValue(),
			namePrefix:namePrefix.getValue(),
			nameSuffix:nameSuffix.getValue()
		};
		CommunityTool.updateUsersMainPerson(person,delegate);
	},
	
	
	
	_search : function() {
		var selected = selector.getValues();
		//list.loadData("ListData.php?query="+search.getValue()+(selected.length>0 ? "&type="+selected[0] : ""));
		In2iGui.dwrUpdate(CommunityTool.getProfileGuiData);
	}
}