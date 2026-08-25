export function loader() {
  const robots = `User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /staff/\nDisallow: /api/\n`;
  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
