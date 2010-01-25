package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=VideoPlayerComponent.TYPE)
public class VideoPlayerComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.videoplayer";

	private String name;
	private String type;
	private int width;
	private int height;
	private String src;

	public VideoPlayerComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		type = (String) state[1];
		width = (Integer) state[2];
		height = (Integer) state[3];
		src = (String) state[4];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name,type,width,height,src
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		StyleBuilder style = new StyleBuilder().withHeight(height+20).withWidth(width);
		writer.startDiv("in2igui_videoplayer").withId(id).withStyle(style);

		writer.endDiv();
		writer.startScopedScript();
		writer.write("new In2iGui.VideoPlayer({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		writer.write(",video:{type:'"+getType(context)+"'");
		writer.write(",src:'"+getSrc(context)+"'");
		writer.write(",width:"+width);
		writer.write(",height:"+height);
		writer.write("}});");
		writer.endScopedScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public String getType(FacesContext context) {
		return getBinding(type, "type");
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getWidth() {
		return width;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getHeight() {
		return height;
	}

	public void setSrc(String src) {
		this.src = src;
	}

	public String getSrc() {
		return src;
	}

	public String getSrc(FacesContext context) {
		return getBinding(src, "src");
	}
}
