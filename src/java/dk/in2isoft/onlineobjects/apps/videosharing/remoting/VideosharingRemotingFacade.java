package dk.in2isoft.onlineobjects.apps.videosharing.remoting;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.model.Comment;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class VideosharingRemotingFacade extends AbstractRemotingFacade {

	public void addComment(long id,String name, String text) throws ModelException, IllegalRequestException {
		Video video = modelService.get(Video.class, id);
		if (video==null) {
			throw new IllegalRequestException("The video could not be found", "videoNotFound");
		}
		if (StringUtils.isBlank(name)) {
			throw new IllegalRequestException("The name is empty", "noName");
		}
		if (StringUtils.isBlank(text)) {
			throw new IllegalRequestException("The text is empty", "noText");
		}
		Comment comment = new Comment();
		comment.setName(name);
		comment.setText(text);
		modelService.createItem(comment, getUserSession());
		modelService.createRelation(video, comment, getUserSession());
	}
}
