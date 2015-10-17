package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.jsf.CheckboxComponent;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Entity;

@FacesComponent(value=PermissionsComponent.FAMILY)
@Dependencies(js = { "/WEB-INF/core/web/js/oo_permissions.js" }, requires = { OnlineObjectsComponent.class}, uses = { CheckboxComponent.class })
public class PermissionsComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.permissions";
	
	public PermissionsComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		SecurityService securityService = Components.getBean(SecurityService.class);
		
		Entity entity = Components.getExpressionValue(this, "entity", context);
		
		out.startDiv().withClass("oo_permissions").withId(getClientId());
		boolean publicView = securityService.canView(entity, securityService.getPublicUser());
		CheckboxComponent check = new CheckboxComponent();
		check.setLabel("Anyone can view it");
		check.setValue(publicView);
		check.encodeAll(context);
		out.endDiv();
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("oo.Permissions").property("element", getClientId()).comma().property("entityId", entity.getId()).endNewObject();
		js.endScript();
	}
}
