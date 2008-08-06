package dk.in2isoft.onlineobjects.publishing;

import dk.in2isoft.onlineobjects.core.EndUserException;

public interface FeedBuilder {

	void buildFeed(Document document, FeedWriter writer) throws EndUserException;

}
