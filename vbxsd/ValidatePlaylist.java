import java.io.File;
import javax.xml.XMLConstants;
import javax.xml.parsers.*;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.*;
import org.w3c.dom.*;

public class ValidatePlaylist {
    public static void main(String[] args) {
        try {
            File xml = new File("playlist.xml");
            File xsd = new File("playlist.xsd");

            // Validate XML
            SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema schema = factory.newSchema(xsd);
            Validator validator = schema.newValidator();
            validator.validate(new StreamSource(xml));
            System.out.println("✅ Playlist is valid!");

            // Parse and display songs
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(xml);
            NodeList songList = doc.getElementsByTagName("song");

            System.out.println("\n🎧 Songs in Playlist:");
            for (int i = 0; i < songList.getLength(); i++) {
                Element song = (Element) songList.item(i);
                String title = song.getElementsByTagName("title").item(0).getTextContent();
                String artist = song.getElementsByTagName("artist").item(0).getTextContent();
                String duration = song.getElementsByTagName("duration").item(0).getTextContent();
                System.out.println((i + 1) + ". " + title + " by " + artist + " [" + duration + "]");
            }

        } catch (Exception e) {
            System.out.println("❌ Invalid Playlist XML.");
            System.out.println("Reason: " + e.getMessage());
        }
    }
}