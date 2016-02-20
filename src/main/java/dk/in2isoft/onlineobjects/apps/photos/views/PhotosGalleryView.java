package dk.in2isoft.onlineobjects.apps.photos.views;

import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Numbers;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;
import dk.in2isoft.onlineobjects.ui.jsf.model.MasonryItem;
import dk.in2isoft.onlineobjects.util.Dates;

public class PhotosGalleryView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	
	private ImageGallery imageGallery;
	private String title;
	
	private String username;

	private User user;
	
	private boolean modifiable;

	private ListModel<Image> listModel;
	private List<Image> images;
	
	private Date from;
	private Date to;
	private String info;
	private String view;
	

	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		Locale locale = request.getLocale();
		String[] path = request.getLocalPath();
		long id = Numbers.parseLong(path[2]);
		if (id>0) {
			imageGallery = modelService.get(ImageGallery.class, id,request.getSession());
			if (imageGallery==null) {
				throw new ContentNotFoundException("The gallery does not exist");
			}
			final UserSession session = request.getSession();
			title = imageGallery.getName();
			user = modelService.getOwner(imageGallery);
			username = user.getUsername();
			modifiable = user!=null && user.getId()==session.getIdentity();
			List<Relation> childRelations = modelService.getRelationsFrom(imageGallery, Image.class, session);
			images = Lists.newArrayList();
			for (Relation relation : childRelations) {
				Image image = (Image) relation.getTo();
				Date date = image.getPropertyDateValue(Property.KEY_PHOTO_TAKEN);
				if (date!=null) {
					if (from==null || from.after(date)) {
						from = date;
					}
					if (to==null || to.before(date)) {
						to = date;
					}
				}
				images.add(image);
			}
			listModel = new ListModel<Image>() {

				@Override
				public ListModelResult<Image> getResult() {
					this.setPageSize(images.size());
					return new ListModelResult<Image>(images,images.size());
				}
				
			};
			
			if (from!=null && to!=null) {
				StringBuilder sb = new StringBuilder();
				String fromShort = Dates.formatShortDate(from, locale);
				String toShort = Dates.formatShortDate(to, locale);
				
				sb.append(fromShort);
				if (!fromShort.equals(toShort)) {
					sb.append(" ").append(Strings.RIGHTWARDS_ARROW).append(" ");
					sb.append(toShort);
				}
				info = sb.toString();
			}
			
			view = request.getString("view");
			if (Strings.isBlank(view)) {
				view = "grid";
			}
		}
	}
	
	private List<MasonryItem> masonryList;
	
	public List<MasonryItem> getMasonryList() {
		if (masonryList==null) {
			masonryList = Lists.newArrayList();
			String language = getRequest().getLanguage();
			masonryList = Lists.newArrayList();
			for (Image image : images) {
				MasonryItem item = new MasonryItem();
				item.id = image.getId();
				item.height = image.getHeight();
				item.width = image.getWidth();
				item.title = image.getName();
				item.href = "/" + language + "/photo/" + item.id + ".html";
				masonryList.add(item);
			}
		}
		return masonryList;
	}
	
	public String getView() {
		return view;
	}
	
	public String getInfo() {
		return info;
	}
	
	public Date getFrom() {
		return from;
	}
	
	public Date getTo() {
		return to;
	}
	
	public ListModel<Image> getListModel() {
		return listModel;
	}
	
	public ImageGallery getImageGallery() {
		return imageGallery;
	}
	
	protected User getUser() {
		return user;
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getTitle() {
		return title;
	}
	
	public boolean isModifiable() {
		return modifiable;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
