import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['EventCompanyOwner'];
  const roles = ['EventCompanyOwner', 'EventPlanner', 'VendorCoordinator', 'Admin', 'EventAttendee'];
  const applicationName = 'EventPro';
  const tenantName = 'Event Planning Company';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `EventCompanyOwner:
1. As an EventCompanyOwner, I want to be able to create and manage multiple event planning teams within my company, so that I can assign specific events to different teams.
2. As an EventCompanyOwner, I want to have an overview of all the events being planned by my company, so that I can track progress and ensure everything is running smoothly.
3. As an EventCompanyOwner, I want to be able to view and manage the financial aspects of each event, so that I can ensure profitability and budget adherence.
4. As an EventCompanyOwner, I want to be able to view and analyze event performance metrics, so that I can make data-driven decisions to improve my company's services.
5. As an EventCompanyOwner, I want to be able to manage and communicate with all vendors and suppliers associated with my company, so that I can maintain strong business relationships.

EventPlanner:
1. As an EventPlanner, I want to be able to create and manage guest lists for each event, so that I can ensure all attendees are accounted for and properly invited.
2. As an EventPlanner, I want to be able to create and manage event schedules, so that I can ensure all activities and timelines are properly organized.
3. As an EventPlanner, I want to be able to collaborate with my team members on event planning tasks, so that we can work efficiently and effectively together.
4. As an EventPlanner, I want to be able to communicate with event attendees, so that I can provide them with important information and updates about the event.
5. As an EventPlanner, I want to be able to manage and track event-related tasks and deadlines, so that I can ensure everything is completed on time.

VendorCoordinator:
1. As a VendorCoordinator, I want to be able to manage and communicate with all vendors and suppliers associated with an event, so that I can ensure their services are properly coordinated.
2. As a VendorCoordinator, I want to be able to track and manage vendor contracts and agreements, so that I can ensure all terms and conditions are met.
3. As a VendorCoordinator, I want to be able to monitor vendor performance and provide feedback, so that I can ensure the highest quality of service for our events.
4. As a VendorCoordinator, I want to be able to manage and track vendor payments, so that I can ensure timely and accurate financial transactions.

Admin:
1. As an Admin, I want to be able to manage user accounts and permissions within the event management platform, so that I can ensure the right people have access to the right information and tools.
2. As an Admin, I want to be able to manage and configure the event management platform's settings and integrations, so that I can ensure the platform is optimized for our company's needs.
3. As an Admin, I want to be able to monitor and maintain the security and performance of the event management platform, so that I can ensure a safe and reliable user experience.

EventAttendee:
1. As an EventAttendee, I want to be able to view event details and schedules, so that I can plan my attendance and participation accordingly.
2. As an EventAttendee, I want to be able to RSVP and manage my event registration, so that I can ensure my attendance is confirmed and accounted for.
3. As an EventAttendee, I want to be able to communicate with event organizers, so that I can ask questions, provide feedback, or address any concerns.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="20px" bottom="20px" zIndex={3}>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody maxH="400px" overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application. Feel free to remove this tutorial with the{' '}
              <Box as="span" bg="yellow.300" p={1}>
                NEXT_PUBLIC_SHOW_BRIEFING
              </Box>{' '}
              environment variable.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
