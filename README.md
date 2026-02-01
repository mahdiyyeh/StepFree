# Step Free

**Plan step-free. Replan fast.**

Step Free is an accessibility-first journey planning web application built for Transport for All, a charity that campaigns for accessible public transport. Unlike traditional route planners that prioritize speed or cost, Step Free uses AI to generate detailed, safety-conscious travel plans that prioritize step-free access, sensory considerations, fatigue limits, and backup options for travelers with accessibility needs.

## Who It Helps

Step Free is designed for people with mobility impairments, wheelchair users, those with sensory sensitivities, and anyone who requires step-free or low-sensory travel options. The app addresses the critical gap in existing journey planners that often fail to account for accessibility barriers like broken lifts, crowded platforms, or routes with unavoidable stairs.

**Charity Alignment:** Built in partnership with Transport for All, Step Free directly supports their mission to make public transport accessible for disabled and older people. The app empowers users to plan journeys with confidence, reducing anxiety and increasing independence.

## Hackathon Tracks

### IMC Tech for Good
Step Free addresses a real-world accessibility challenge faced by millions of disabled travelers daily. By providing free, accessible journey planning that prioritizes safety and inclusion over speed, the app directly supports Transport for All's mission to create a more accessible transport network.

### Best Travel Hack
Step Free reimagines journey planning from an accessibility-first perspective. Unlike existing apps that show "fastest route" or "cheapest option," Step Free generates multiple backup plans, accounts for disruptions (broken lifts, weather, fatigue), and provides detailed accessibility notes for each step. It's the first journey planner built specifically for disabled travelers.


## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude 3.5 Sonnet (via Messages API)
- **Validation:** Zod schema validation
- **Deployment:** Ready for Vercel/Netlify

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Add your Anthropic API key:**
   Edit `.env.local` and add:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)



## Future Improvements

- **Real-time data integration:** Connect to TfL API for live lift status, service disruptions, and platform accessibility
- **Map visualization:** Add interactive maps showing step-free routes and accessible stations
- **Saved journeys:** Allow users to save and revisit favorite routes
- **Community features:** Enable users to report lift outages or accessibility issues
- **Multi-modal routing:** Expand beyond London to other UK cities and transport networks
- **Voice interface:** Add screen reader optimization and voice commands
- **Offline mode:** Cache common routes for use without internet connection
- **Mobile app:** Native iOS/Android apps with push notifications for disruptions

## License

Built for Transport for All hackathon. All rights reserved.
