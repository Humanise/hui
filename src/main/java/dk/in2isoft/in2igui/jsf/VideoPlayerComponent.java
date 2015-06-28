package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.data.VideoData;

@FacesComponent(value=VideoPlayerComponent.TYPE)
public class VideoPlayerComponent extends AbstractComponent {

	public static final String TYPE = "hui.videoplayer";

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
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String contentType = type;
		String url = src;
		String xHtml = getBinding("html");
		String posterUrl = null;
		VideoData data = getBinding("value");
		if (data!=null) {
			contentType = data.getContentType();
			url = data.getUrl(width, height);
			xHtml = data.getHtml(width, height);
			posterUrl = data.getPosterUrl(width, height);
		}
		
		String id = getClientId();
		StyleBuilder style = new StyleBuilder().withHeight(height).withWidth(width);
		writer.startDiv("in2igui_videoplayer").withId(id).withStyle(style);
		StyleBuilder placeStyle = new StyleBuilder().withHeight(height-2);
		if (StringUtils.isNotBlank(posterUrl)) {
			placeStyle.withBackgroundImage(posterUrl);
		}
		writer.startDiv("in2igui_videoplayer_placeholder").withStyle(placeStyle);
		writer.startSpan("in2igui_videoplayer_placeholder_height").endSpan();
		writer.startSpan("in2igui_videoplayer_placeholder_info");
		writer.startSpan("in2igui_videoplayer_play").endSpan().startStrong().write("Click to play!").endStrong();
		writer.endSpan();
		writer.endDiv();
		writer.endDiv();
		writer.startScopedScript();
		writer.write("new hui.ui.VideoPlayer({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		writer.write(",video:{type:'"+contentType+"'");
		writer.write(",src:'"+url+"'");
		writer.write(",width:"+width);
		writer.write(",height:"+height);
		if (StringUtils.isNotBlank(xHtml)) {
			writer.write(",html:'").write(xHtml).write("'");
		}
		if (StringUtils.isNotBlank(posterUrl)) {
			writer.write(",poster:'").write(posterUrl).write("'");
		}
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
		return getExpression("type", type, context);
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
		return getExpression("src", src, context);
	}
}
