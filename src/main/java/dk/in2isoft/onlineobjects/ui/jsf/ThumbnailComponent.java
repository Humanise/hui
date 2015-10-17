package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Numbers;
import dk.in2isoft.in2igui.jsf.ImageViewerComponent;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.util.images.ImageService;

@FacesComponent(value = ThumbnailComponent.FAMILY)
@Dependencies(css = { "/WEB-INF/core/web/css/oo_thumbnail.css" }, requires = { OnlineObjectsComponent.class })
public class ThumbnailComponent extends AbstractComponent implements DependableComponent {

	public static final String FAMILY = "onlineobjects.thumbnail";

	private Integer width;
	private Integer height;
	private String variant;
	private boolean zoom;
	private boolean present;
	private String href;
	private boolean frame = true;
	private String app;
	private double sharpen = 1.0;
	private String className;
	private boolean responsive;

	public ThumbnailComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		width = (Integer) state[0];
		height = (Integer) state[1];
		variant = (String) state[2];
		zoom = (Boolean) state[3];
		href = (String) state[4];
		frame = (Boolean) state[5];
		app = (String) state[6];
		sharpen = (Double) state[7];
		present = (Boolean) state[8];
		className = (String) state[9];
		responsive = (Boolean) state[9];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { width, height, variant, zoom, href, frame, app, sharpen, present, className, responsive };
	}

	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String href = getHref(context);
		Image image = getBinding("image");
		StyleBuilder style = new StyleBuilder();
		style.withWidth(width).withHeight(height);

		Double rotation = null;
		boolean rotated = false;
		double imageHeight = 0;
		double imageWidth = 0;

		if (image != null) {
			rotation = image.getPropertyDoubleValue(Property.KEY_PHOTO_ROTATION);
			rotated = (rotation != null && (rotation == -90 || rotation == 90));
			imageHeight = (double) image.getHeight();
			imageWidth = (double) image.getWidth();
			if (rotated) {
				double temp = imageHeight;
				imageHeight = imageWidth;
				imageWidth = temp;

			}
		}
		if (image != null && responsive) {
			double percent = (imageHeight / imageWidth) * 100;
			style.withRule("padding-bottom: " + percent + "%;");
		}
		ClassBuilder cls = new ClassBuilder("oo_thumbnail").add("oo_thumbnail", variant);
		if (zoom || present) {
			cls.add("oo_thumbnail_zoom");
		}
		if (frame) {
			cls.add("oo_thumbnail_frame");
		}
		cls.add(className);
		out.startSpan(cls).withStyle(style);
		UIComponent hover = getFacet("hover");
		if (hover != null) {
			out.startSpan("oo_thumbnail_hover");
			context.getExternalContext().getFlash().putNow("item", image);
			hover.encodeAll(context);
			out.endSpan();
		}
		if (StringUtils.isNotBlank(href)) {
			out.startA().withAttribute("href", LinkComponent.buildUrl(href, app, false));
		}

		if (image != null) {
			ImageService imageService = getBean(ImageService.class);
			boolean valid = imageService.hasImageFile(image);
			if (valid) {
				boolean flipVertically = image.getPropertyBooleanValue(Property.KEY_PHOTO_FLIP_VERTICALLY);
				boolean flipHorizontally = image.getPropertyBooleanValue(Property.KEY_PHOTO_FLIP_HORIZONTALLY);

				int wdth = 0;
				if (width == null) {
					wdth = (int) (((double) height / imageHeight) * imageWidth);
				} else {
					wdth = width;
				}
				int hght = 0;
				if (height == null) {
					hght = (int) (((double) width / imageWidth) * imageHeight);
				} else {
					hght = height;
				}
				StyleBuilder stl = new StyleBuilder();
				stl.withWidth(wdth).withHeight(hght);

				StringBuilder url = new StringBuilder();
				url.append(Components.getRequest().getBaseContext());
				url.append("/service/image/id").append(image.getId()).append("width").append(wdth).append("height").append(hght);
				if (sharpen > 0) {
					url.append("sharpen").append(Numbers.formatDecimal(sharpen, 2));
				}
				if (rotation != null) {
					url.append("rotation").append(rotation);
				}
				if (flipHorizontally) {
					url.append("-fliph");
				}
				if (flipVertically) {
					url.append("-flipv");
				}
				url.append("cropped.jpg");
				out.startElement("img").withAttribute("src", url).withAttribute("alt", image.getName());
				if (zoom) {
					StringBuilder onClick = new StringBuilder();
					onClick.append("oo.showImage({id:").append(image.getId()).append(",width:").append(image.getWidth()).append(",height:").append(image.getHeight()).append("});");
					out.withAttribute("onclick", onClick);
				} else if (present) {
					StringBuilder onClick = new StringBuilder();
					onClick.append("oo.presentImage({id:").append(image.getId()).append(",width:").append(image.getWidth()).append(",height:").append(image.getHeight())
							.append("});");
					out.withAttribute("onclick", onClick);
				}
				out.withStyle(stl).endElement("img");
			}
		}
		if (StringUtils.isNotBlank(href)) {
			out.endA();
		}
		out.endSpan();
	}

	@Override
	public String[] getScripts(FacesContext context) {
		return null;
	}

	@Override
	public String[] getStyles(FacesContext context) {
		return null;
	}

	public Class<?>[] getComponents(FacesContext context) {
		if (zoom) {
			return new Class[] { ImageViewerComponent.class };
		} else if (present) {
			return new Class[] { PhotoViewerComponent.class };
		}
		return null;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getWidth() {
		return width;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getHeight() {
		return height;
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

	public String getVariant() {
		return variant;
	}

	public void setZoom(boolean zoom) {
		this.zoom = zoom;
	}

	public boolean isZoom() {
		return zoom;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getHref() {
		return href;
	}

	public String getHref(FacesContext context) {
		return getExpression("href", href, context);
	}

	public void setFrame(boolean frame) {
		this.frame = frame;
	}

	public boolean isFrame() {
		return frame;
	}

	public void setApp(String app) {
		this.app = app;
	}

	public String getApp() {
		return app;
	}

	public double getSharpen() {
		return sharpen;
	}

	public void setSharpen(double sharpen) {
		this.sharpen = sharpen;
	}

	public boolean isPresent() {
		return present;
	}

	public void setPresent(boolean present) {
		this.present = present;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public boolean isResponsive() {
		return responsive;
	}

	public void setResponsive(boolean responsive) {
		this.responsive = responsive;
	}
}
