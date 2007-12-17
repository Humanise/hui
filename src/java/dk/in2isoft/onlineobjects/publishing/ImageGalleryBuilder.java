package dk.in2isoft.onlineobjects.publishing;

import java.util.List;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;

public class ImageGalleryBuilder extends DocumentBuilder {

	private static String NAMESPACE = "http://uri.onlineobjects.com/publishing/Document/ImageGallery/";

	private ImageGallery gallery;
	// private static Logger log = Logger.getLogger(ImageGalleryBuilder.class);

	public ImageGalleryBuilder(Document document) {
		super(document);
		this.gallery = (ImageGallery) document;
	}

	@Override
	public Node build() throws EndUserException {
		String style = gallery.getProperty(ImageGallery.PROPERTY_FRAMESTYLE);
		if (style==null) style="simple";
		Element root = new Element("ImageGallery", NAMESPACE);
		Element settings = new Element("settings", NAMESPACE);
		settings.addAttribute(new Attribute("tiledColumns",String.valueOf(gallery.getTiledColumns())));
		settings.addAttribute(new Attribute("tiledWidth",String.valueOf(gallery.getTiledWidth())));
		settings.addAttribute(new Attribute("tiledHeight",String.valueOf(gallery.getTiledHeight())));
		settings.addAttribute(new Attribute("style",style));
		root.appendChild(settings);
		Element tiled = new Element("tiled", NAMESPACE);
		root.appendChild(tiled);
		Element row = new Element("row", NAMESPACE);
		int columns = gallery.getTiledColumns();
		List<Entity> images = getModel().getSubEntities(this.gallery, Image.class);
		for (int i=0;i<images.size();i++) {
			if (i % columns == 0) {
				row = new Element("row", NAMESPACE);
				tiled.appendChild(row);
			}
			Entity image = images.get(i);
			row.appendChild(Core.getInstance().getConverter().generateXML(image));
		}
		return root;
	}

}
