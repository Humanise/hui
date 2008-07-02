package dk.in2isoft.onlineobjects.publishing;

import java.util.List;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.ConversionFacade;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;

public class ImageGalleryBuilder extends DocumentBuilder {

	private static String NAMESPACE = "http://uri.onlineobjects.com/publishing/Document/ImageGallery/";

	// private static Logger log = Logger.getLogger(ImageGalleryBuilder.class);

	public ImageGalleryBuilder() {
		super();
	}

	@Override
	public Node build(Document document) throws EndUserException {
		ImageGallery gallery = (ImageGallery) document;
		ConversionFacade converter = Core.getInstance().getConverter();
		
		String style = gallery.getProperty(ImageGallery.PROPERTY_FRAMESTYLE);
		if (style==null) style="simple";
		Element root = new Element("ImageGallery", NAMESPACE);
		Element settings = new Element("settings", NAMESPACE);
		settings.addAttribute(new Attribute("tiledColumns",String.valueOf(gallery.getTiledColumns())));
		settings.addAttribute(new Attribute("tiledWidth",String.valueOf(gallery.getTiledWidth())));
		settings.addAttribute(new Attribute("tiledHeight",String.valueOf(gallery.getTiledHeight())));
		settings.addAttribute(new Attribute("style",style));
		root.appendChild(settings);
		
		HeaderPart header = (HeaderPart)getModel().getFirstSubEntity(gallery, HeaderPart.class);
		if (header!=null) {
			root.appendChild(converter.generateXML(header));
		}
		
		Element tiled = new Element("tiled", NAMESPACE);
		root.appendChild(tiled);
		Element row = new Element("row", NAMESPACE);
		int columns = gallery.getTiledColumns();
		List<Entity> images = getModel().getSubEntities(gallery, Image.class);
		for (int i=0;i<images.size();i++) {
			if (i % columns == 0) {
				row = new Element("row", NAMESPACE);
				tiled.appendChild(row);
			}
			Entity image = images.get(i);
			row.appendChild(converter.generateXML(image));
		}
		return root;
	}

	@Override
	public Entity create(Priviledged priviledged) throws EndUserException {
		ModelFacade model = Core.getInstance().getModel();
		
		// Create an image gallery
		ImageGallery gallery = new ImageGallery();
		gallery.setName("My new image gallery");
		model.createItem(gallery,priviledged);
		
		// Create gallery title
		HeaderPart header = new HeaderPart();
		header.setText("My new image gallery");
		model.createItem(header, priviledged);
		
		Relation galleryHeaderRelation = new Relation(gallery,header);
		model.createItem(galleryHeaderRelation, priviledged);
		
		return gallery;
	}

}
