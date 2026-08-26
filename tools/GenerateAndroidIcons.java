import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.geom.Ellipse2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.imageio.ImageIO;

public final class GenerateAndroidIcons {
  private static final int SUPERSAMPLING = 4;
  private static final Map<String, Double> DENSITIES = new LinkedHashMap<>();

  static {
    DENSITIES.put("mdpi", 1.0);
    DENSITIES.put("hdpi", 1.5);
    DENSITIES.put("xhdpi", 2.0);
    DENSITIES.put("xxhdpi", 3.0);
    DENSITIES.put("xxxhdpi", 4.0);
  }

  private GenerateAndroidIcons() {}

  public static void main(String[] args) throws IOException {
    Path projectRoot = Path.of("").toAbsolutePath().normalize();
    Path sourcePath = args.length > 0
        ? projectRoot.resolve(args[0]).normalize()
        : projectRoot.resolve("assets/cvatsexpress.png");
    BufferedImage source = ImageIO.read(sourcePath.toFile());
    if (source == null) {
      throw new IOException("Unsupported icon source: " + sourcePath);
    }

    Color background = sampleBackgroundColor(source);
    BufferedImage monochromeSource = createMonochromeMask(source);
    Path resources = projectRoot.resolve("android/app/src/main/res");
    writeBackgroundColor(resources, background);

    for (Map.Entry<String, Double> density : DENSITIES.entrySet()) {
      Path outputDirectory = resources.resolve("mipmap-" + density.getKey());
      Files.createDirectories(outputDirectory);

      double multiplier = density.getValue();
      writePng(
          renderLegacyIcon(
              source,
              (int) Math.round(48 * multiplier),
              background,
              false),
          outputDirectory.resolve("ic_launcher.png"));
      writePng(
          renderLegacyIcon(
              source,
              (int) Math.round(48 * multiplier),
              background,
              true),
          outputDirectory.resolve("ic_launcher_round.png"));
      writePng(
          renderAdaptiveForeground(
              source,
              (int) Math.round(108 * multiplier),
              background),
          outputDirectory.resolve("ic_launcher_foreground.png"));
      BufferedImage monochrome = renderAdaptiveMonochrome(
          monochromeSource,
          (int) Math.round(108 * multiplier));
      validateMonochromeMask(monochrome);
      writePng(
          monochrome,
          outputDirectory.resolve("ic_launcher_monochrome.png"));
    }

    System.out.printf(
        "Generated Android launcher icons from %s with background #%02X%02X%02X%n",
        projectRoot.relativize(sourcePath),
        background.getRed(),
        background.getGreen(),
        background.getBlue());
  }

  private static BufferedImage renderLegacyIcon(
      BufferedImage source,
      int size,
      Color background,
      boolean round) {
    int canvasSize = size * SUPERSAMPLING;
    BufferedImage canvas = new BufferedImage(
        canvasSize,
        canvasSize,
        BufferedImage.TYPE_INT_ARGB);
    Graphics2D graphics = configuredGraphics(canvas);

    Shape mask = round
        ? new Ellipse2D.Double(0, 0, canvasSize, canvasSize)
        : new RoundRectangle2D.Double(
            0,
            0,
            canvasSize,
            canvasSize,
            canvasSize * 0.22,
            canvasSize * 0.22);
    graphics.setClip(mask);
    graphics.setColor(background);
    graphics.fill(mask);

    double artworkScale = round ? 0.78 : 0.84;
    drawCentered(graphics, source, canvasSize, artworkScale);
    graphics.dispose();
    return downsample(canvas, size);
  }

  private static BufferedImage renderAdaptiveForeground(
      BufferedImage source,
      int size,
      Color background) {
    int canvasSize = size * SUPERSAMPLING;
    BufferedImage canvas = new BufferedImage(
        canvasSize,
        canvasSize,
        BufferedImage.TYPE_INT_ARGB);
    Graphics2D graphics = configuredGraphics(canvas);
    graphics.setColor(background);
    graphics.fillRect(0, 0, canvasSize, canvasSize);
    drawCentered(graphics, source, canvasSize, 0.52);
    graphics.dispose();
    return downsample(canvas, size);
  }

  private static BufferedImage renderAdaptiveMonochrome(
      BufferedImage monochromeSource,
      int size) {
    int canvasSize = size * SUPERSAMPLING;
    BufferedImage canvas = new BufferedImage(
        canvasSize,
        canvasSize,
        BufferedImage.TYPE_INT_ARGB);
    Graphics2D graphics = configuredGraphics(canvas);
    drawCentered(graphics, monochromeSource, canvasSize, 0.52);
    graphics.dispose();
    return downsample(canvas, size);
  }

  private static Graphics2D configuredGraphics(BufferedImage canvas) {
    Graphics2D graphics = canvas.createGraphics();
    graphics.setRenderingHint(
        RenderingHints.KEY_INTERPOLATION,
        RenderingHints.VALUE_INTERPOLATION_BICUBIC);
    graphics.setRenderingHint(
        RenderingHints.KEY_RENDERING,
        RenderingHints.VALUE_RENDER_QUALITY);
    graphics.setRenderingHint(
        RenderingHints.KEY_ANTIALIASING,
        RenderingHints.VALUE_ANTIALIAS_ON);
    return graphics;
  }

  private static void drawCentered(
      Graphics2D graphics,
      BufferedImage source,
      int canvasSize,
      double artworkScale) {
    int artworkSize = (int) Math.round(canvasSize * artworkScale);
    int offset = (canvasSize - artworkSize) / 2;
    graphics.drawImage(
        source,
        offset,
        offset,
        artworkSize,
        artworkSize,
        null);
  }

  private static BufferedImage downsample(BufferedImage source, int size) {
    BufferedImage target = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
    Graphics2D graphics = configuredGraphics(target);
    graphics.drawImage(source, 0, 0, size, size, null);
    graphics.dispose();
    return target;
  }

  private static BufferedImage createMonochromeMask(BufferedImage source) {
    BufferedImage mask = new BufferedImage(
        source.getWidth(),
        source.getHeight(),
        BufferedImage.TYPE_INT_ARGB);

    for (int y = 0; y < source.getHeight(); y += 1) {
      for (int x = 0; x < source.getWidth(); x += 1) {
        Color color = new Color(source.getRGB(x, y), true);
        int maximum = Math.max(
            color.getRed(),
            Math.max(color.getGreen(), color.getBlue()));
        int minimum = Math.min(
            color.getRed(),
            Math.min(color.getGreen(), color.getBlue()));
        double saturation = maximum - minimum;
        double luminance = color.getRed() * 0.2126
            + color.getGreen() * 0.7152
            + color.getBlue() * 0.0722;
        double contrast = Math.max(saturation * 1.8, 245 - luminance);
        int alpha = clamp((int) Math.round((contrast - 18) * 8));
        mask.setRGB(x, y, new Color(0, 0, 0, alpha).getRGB());
      }
    }
    return mask;
  }

  private static Color sampleBackgroundColor(BufferedImage source) {
    int sampleSize = Math.max(1, Math.min(source.getWidth(), source.getHeight()) / 20);
    long red = 0;
    long green = 0;
    long blue = 0;
    long count = 0;

    for (int y = 0; y < sampleSize; y += 1) {
      for (int x = 0; x < sampleSize; x += 1) {
        Color color = new Color(source.getRGB(x, y));
        red += color.getRed();
        green += color.getGreen();
        blue += color.getBlue();
        count += 1;
      }
    }

    return new Color(
        (int) (red / count),
        (int) (green / count),
        (int) (blue / count));
  }

  private static int clamp(int value) {
    return Math.max(0, Math.min(255, value));
  }

  private static void validateMonochromeMask(BufferedImage image)
      throws IOException {
    long visiblePixels = 0;
    long totalPixels = (long) image.getWidth() * image.getHeight();
    for (int y = 0; y < image.getHeight(); y += 1) {
      for (int x = 0; x < image.getWidth(); x += 1) {
        int alpha = (image.getRGB(x, y) >>> 24) & 0xFF;
        if (alpha > 8) {
          visiblePixels += 1;
        }
      }
    }

    double coverage = (double) visiblePixels / totalPixels;
    if (coverage < 0.01 || coverage > 0.60) {
      throw new IOException(
          "Unexpected monochrome mask coverage: " + coverage);
    }
  }

  private static void writePng(BufferedImage image, Path path) throws IOException {
    if (!ImageIO.write(image, "png", path.toFile())) {
      throw new IOException("PNG writer is unavailable for " + path);
    }
  }

  private static void writeBackgroundColor(Path resources, Color background)
      throws IOException {
    String xml = String.format(
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>%n"
            + "<resources>%n"
            + "    <color name=\"ic_launcher_background\">#%02X%02X%02X</color>%n"
            + "</resources>%n",
        background.getRed(),
        background.getGreen(),
        background.getBlue());
    Files.writeString(resources.resolve("values/ic_launcher_background.xml"), xml);
  }
}
