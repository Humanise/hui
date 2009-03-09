package dk.in2isoft.onlineobjects.model;

public class Property {
	
	public static final String KEY_COMMON_TAG = "common.tag";
	public static final String KEY_STYLE_MARGIN_TOP = "style.margin.top";
	public static final String KEY_STYLE_MARGIN_BOTTOM = "style.margin.bottom";
	public static final String KEY_STYLE_MARGIN_LEFT = "style.margin.left";
	public static final String KEY_STYLE_MARGIN_RIGHT = "style.margin.right";
	public static final String KEY_HUMAN_INTEREST = "human.interest";
	public static final String KEY_HUMAN_FAVORITE_MUSIC = "human.favorite.music";
	public static final String KEY_HUMAN_FAVORITE_MOVIE = "human.favorite.movie";
	public static final String KEY_HUMAN_FAVORITE_TELEVISIONPROGRAM = "human.favorite.televisionprogram";
	public static final String KEY_HUMAN_FAVORITE_BOOK = "human.favorite.book";
	public static final String KEY_HUMAN_RESUME = "human.resume";

	private long id;

	private String key;
	private String value;

	public Property() {
		super();
	}

	public Property(String key,String value) {
		super();
		this.value = value;
		this.key = key;
	}
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
