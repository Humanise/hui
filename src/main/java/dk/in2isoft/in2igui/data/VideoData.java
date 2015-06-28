package dk.in2isoft.in2igui.data;

public interface VideoData {


	String getContentType();
	
	String getUrl(int width, int height);
	
	String getPosterUrl(int width,int height);

	String getHtml(int width, int height);
}
