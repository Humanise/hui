package dk.in2isoft.onlineobjects.model;

import dk.in2isoft.onlineobjects.publishing.Document;
import dk.in2isoft.onlineobjects.publishing.DocumentBuilder;
import dk.in2isoft.onlineobjects.publishing.ImageGalleryBuilder;


public class ImageGallery extends Entity implements Document {

	public static final String PROPERTY_FRAMESTYLE = "item.entity.imagegallery.framestyle";
	public static String TYPE = Entity.TYPE+"/ImageGallery";
	public static String NAMESPACE = Entity.NAMESPACE+"ImageGallery/";
	
	private int tiledColumns;
	private int tiledSize;
	
	public ImageGallery() {
		super();
		this.tiledColumns = 3;
		this.tiledSize = 150;
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Template/Generic";
	}
	
	public int getTiledColumns() {
		return tiledColumns;
	}

	public void setTiledColumns(int tiledColumns) {
		this.tiledColumns = tiledColumns;
	}

	public int getTiledSize() {
		return tiledSize;
	}

	public void setTiledSize(int tiledSize) {
		this.tiledSize = tiledSize;
	}

	public DocumentBuilder getBuilder() {
		return new ImageGalleryBuilder(this);
	}
}
