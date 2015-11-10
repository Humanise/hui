package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;

public class InternetAddressEditPerspective {

	private long id;
	private String title;
	private String address;
	private List<ItemData> authors;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public void setAuthors(List<ItemData> authors) {
		this.authors = authors;
	}
	
	public List<ItemData> getAuthors() {
		return authors;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	public static void validate(InternetAddressEditPerspective perspective) throws IllegalRequestException {
		if (perspective==null) {
			throw new IllegalRequestException("No data");
		}
		if (perspective.getId() < 1) {
			throw new IllegalRequestException("Invalid ID");
		}
		if (Strings.isBlank(perspective.getTitle())) {
			throw new IllegalRequestException("The title is empty");
		}
		if (Strings.isBlank(perspective.getAddress())) {
			throw new IllegalRequestException("The address is empty");
		}
	}
}
