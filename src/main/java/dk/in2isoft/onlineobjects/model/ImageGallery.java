package dk.in2isoft.onlineobjects.model;

import dk.in2isoft.onlineobjects.publishing.Document;
import dk.in2isoft.onlineobjects.publishing.DocumentBuilder;
import dk.in2isoft.onlineobjects.publishing.ImageGalleryBuilder;


public class ImageGallery extends Entity implements Document {

	public static final String PROPERTY_FRAMESTYLE = "item.entity.imagegallery.framestyle";
	public static String TYPE = Entity.TYPE+"/ImageGallery";
	public static String NAMESPACE = Entity.NAMESPACE+"ImageGallery/";
	
	private int tiledColumns;
	private int tiledHeight;
	private int tiledWidth;
	
	public ImageGallery() {
		super();
		this.tiledColumns = 3;
		this.tiledWidth = 150;
		this.tiledHeight = 100;
	}

	public String getType() {
		return TYPE;
	}
	
	public int getTiledColumns() {
		return tiledColumns;
	}

	public void setTiledColumns(int tiledColumns) {
		this.tiledColumns = tiledColumns;
	}

	public DocumentBuilder getBuilder() {
		return new ImageGalleryBuilder();
	}

	public int getTiledHeight() {
		return tiledHeight;
	}

	public void setTiledHeight(int tiledHeight) {
		this.tiledHeight = tiledHeight;
	}

	public int getTiledWidth() {
		return tiledWidth;
	}

	public void setTiledWidth(int tiledWidth) {
		this.tiledWidth = tiledWidth;
	}
}
