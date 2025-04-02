import { UFOType } from '../types';

export interface ContinentUFOReaction {
  ufoType: UFOType;
  reactionLevel: number; // 0-100, where 0 is calm/curious and 100 is full panic
  description: string;
}

export interface ContinentLore {
  id: string;
  historicalContext: string;
  culturalSignificance: string;
  ufoHistory: string;
  reactions: ContinentUFOReaction[];
}

export const CONTINENT_LORE: Record<string, ContinentLore> = {
  northAmerica: {
    id: 'northAmerica',
    historicalContext: 'Modern history of UFO sightings began with the 1947 Roswell incident, establishing North America as a hotbed of UFO activity and conspiracy theories.',
    culturalSignificance: 'Home to Area 51, numerous military bases, and a strong pop culture connection to UFOs through movies and media. The public is both fascinated and deeply suspicious of alien activity.',
    ufoHistory: 'Notable events include the Phoenix Lights (1997), multiple nuclear facility observations, and frequent military encounters. Government agencies have historically denied or downplayed UFO incidents.',
    reactions: [
      {
        ufoType: 'scout',
        reactionLevel: 60,
        description: 'High media coverage and widespread amateur investigation attempts. Public tends to be alarmed due to historical distrust of government UFO handling.'
      },
      {
        ufoType: 'fighter',
        reactionLevel: 85,
        description: 'Severe public unrest and demands for military action. Strong parallels drawn to Independence Day and War of the Worlds scenarios.'
      },
      {
        ufoType: 'transport',
        reactionLevel: 70,
        description: 'Fear of alien invasion and colonization. Conspiracy theories about human abduction spread rapidly.'
      },
      {
        ufoType: 'harvester',
        reactionLevel: 75,
        description: 'Public connects sightings to cattle mutilation phenomena and resource theft theories.'
      },
      {
        ufoType: 'mothership',
        reactionLevel: 95,
        description: 'Mass panic and widespread civil unrest. Strong demands for government action and military response.'
      },
      {
        ufoType: 'science',
        reactionLevel: 65,
        description: 'Public fear of human experimentation, reminiscent of alien abduction stories.'
      },
      {
        ufoType: 'builder',
        reactionLevel: 80,
        description: 'Fears of alien colonization and permanent base establishment.'
      }
    ]
  },
  southAmerica: {
    id: 'southAmerica',
    historicalContext: 'Ancient civilizations like the Nazca created massive geoglyphs visible from the sky, suggesting a long history of sky-watching and possible extraterrestrial connections.',
    culturalSignificance: 'Many indigenous cultures maintain traditions that speak of "sky beings" and celestial visitors. The Nazca Lines are often interpreted as landing strips or communication attempts with celestial beings.',
    ufoHistory: 'Numerous historical records of strange lights and objects, particularly around ancient sites. The continent has experienced multiple waves of UFO sightings near sacred sites.',
    reactions: [
      {
        ufoType: 'scout',
        reactionLevel: 30,
        description: 'General curiosity and spiritual interpretation. Many view scouts as messengers from ancient sky beings.'
      },
      {
        ufoType: 'fighter',
        reactionLevel: 70,
        description: 'Significant concern but tempered by cultural beliefs about celestial beings.'
      },
      {
        ufoType: 'transport',
        reactionLevel: 40,
        description: 'Interpreted through the lens of ancient astronaut theories and cultural myths about sky people.'
      },
      {
        ufoType: 'harvester',
        reactionLevel: 60,
        description: 'Concerns about resource exploitation, connected to historical colonial experiences.'
      },
      {
        ufoType: 'mothership',
        reactionLevel: 75,
        description: 'Major concern but some groups view it as the return of ancient sky gods.'
      },
      {
        ufoType: 'science',
        reactionLevel: 35,
        description: 'Often interpreted as knowledge-seekers, connecting to ancient wisdom traditions.'
      },
      {
        ufoType: 'builder',
        reactionLevel: 50,
        description: 'Mixed reactions, with some seeing it as fulfillment of ancient prophecies.'
      }
    ]
  },
  europe: {
    id: 'europe',
    historicalContext: 'Rich history of UFO sightings dating back to medieval times, often interpreted through religious or scientific lenses depending on the era.',
    culturalSignificance: 'Home to numerous scientific institutions and space agencies. Strong emphasis on rational, scientific investigation of UFO phenomena.',
    ufoHistory: 'Notable cases include the Belgian UFO wave (1989-1990) and multiple military encounters. Strong tradition of scientific investigation of UFO phenomena.',
    reactions: [
      {
        ufoType: 'scout',
        reactionLevel: 45,
        description: 'Scientific curiosity dominates public reaction, with calls for investigation and study.'
      },
      {
        ufoType: 'fighter',
        reactionLevel: 80,
        description: 'Serious concern due to historical experience with air warfare. Strong push for unified defense response.'
      },
      {
        ufoType: 'transport',
        reactionLevel: 60,
        description: 'Concern about potential refugee or invasion scenarios, reflecting historical experiences.'
      },
      {
        ufoType: 'harvester',
        reactionLevel: 70,
        description: 'Environmental concerns and worries about resource depletion.'
      },
      {
        ufoType: 'mothership',
        reactionLevel: 85,
        description: 'Coordinated panic across nations, calls for unified European response.'
      },
      {
        ufoType: 'science',
        reactionLevel: 50,
        description: 'Scientific community shows intense interest, public concern about ethical implications.'
      },
      {
        ufoType: 'builder',
        reactionLevel: 65,
        description: 'Concerns about territorial sovereignty and permanent alien presence.'
      }
    ]
  },
  asia: {
    id: 'asia',
    historicalContext: 'Long history of celestial phenomena in cultural records, from ancient China\'s detailed astronomical observations to Japan\'s modern UFO encounters.',
    culturalSignificance: 'Many Asian cultures have traditional beliefs about celestial beings and sky phenomena. Strong technological focus in modern times.',
    ufoHistory: 'Numerous military encounters, particularly in China and Japan. Multiple cases of UFO sightings near nuclear facilities and major cities.',
    reactions: [
      {
        ufoType: 'scout',
        reactionLevel: 40,
        description: 'Measured response with focus on technological analysis and documentation.'
      },
      {
        ufoType: 'fighter',
        reactionLevel: 75,
        description: 'High alert status and military mobilization, particularly in technologically advanced nations.'
      },
      {
        ufoType: 'transport',
        reactionLevel: 55,
        description: 'Concern about territorial violations and potential military implications.'
      },
      {
        ufoType: 'harvester',
        reactionLevel: 65,
        description: 'Worries about economic impact and resource security.'
      },
      {
        ufoType: 'mothership',
        reactionLevel: 80,
        description: 'Major public concern balanced with organized government response.'
      },
      {
        ufoType: 'science',
        reactionLevel: 45,
        description: 'Interest in potential technological advancements and research opportunities.'
      },
      {
        ufoType: 'builder',
        reactionLevel: 70,
        description: 'Strategic concerns about alien infrastructure in territorial waters or land.'
      }
    ]
  },
  africa: {
    id: 'africa',
    historicalContext: 'Rich oral traditions of celestial beings and sky phenomena, with many ancient rock arts depicting possible UFO sightings.',
    culturalSignificance: 'Many cultures maintain traditional beliefs about celestial beings and their influence on Earth. Strong connection between UFO phenomena and spiritual beliefs.',
    ufoHistory: 'Notable cases include the Zimbabwe school UFO incident (1994) and multiple sightings near mining operations.',
    reactions: [
      {
        ufoType: 'scout',
        reactionLevel: 35,
        description: 'Often interpreted through traditional spiritual beliefs, generally calm reaction.'
      },
      {
        ufoType: 'fighter',
        reactionLevel: 65,
        description: 'Concern about military implications and sovereignty issues.'
      },
      {
        ufoType: 'transport',
        reactionLevel: 50,
        description: 'Mixed reactions based on regional spiritual beliefs and modern political concerns.'
      },
      {
        ufoType: 'harvester',
        reactionLevel: 80,
        description: 'Strong concerns about resource exploitation, particularly near mining regions.'
      },
      {
        ufoType: 'mothership',
        reactionLevel: 70,
        description: 'Varied responses ranging from spiritual interpretation to political concern.'
      },
      {
        ufoType: 'science',
        reactionLevel: 40,
        description: 'Interest in potential benefits, tempered by historical experiences with exploitation.'
      },
      {
        ufoType: 'builder',
        reactionLevel: 60,
        description: 'Concerns about territorial sovereignty and resource rights.'
      }
    ]
  },
  oceania: {
    id: 'oceania',
    historicalContext: 'Aboriginal and Pacific Islander cultures have long traditions of sky beings and celestial visitors. Modern era marked by significant military observation programs.',
    culturalSignificance: 'Strong indigenous traditions about sky beings and celestial navigation. Modern scientific approach through observatories and tracking stations.',
    ufoHistory: 'Notable cases include the Westall UFO incident (1966) and numerous observations by civilian pilots.',
    reactions: [
      {
        ufoType: 'scout',
        reactionLevel: 35,
        description: 'Generally calm reaction, influenced by indigenous perspectives on sky visitors.'
      },
      {
        ufoType: 'fighter',
        reactionLevel: 70,
        description: 'Significant concern about isolation and defensive capabilities.'
      },
      {
        ufoType: 'transport',
        reactionLevel: 55,
        description: 'Moderate concern, influenced by regional maritime security considerations.'
      },
      {
        ufoType: 'harvester',
        reactionLevel: 75,
        description: 'High concern about marine resource exploitation and environmental impact.'
      },
      {
        ufoType: 'mothership',
        reactionLevel: 80,
        description: 'Major concern about strategic vulnerability due to geographic isolation.'
      },
      {
        ufoType: 'science',
        reactionLevel: 40,
        description: 'Interest in research opportunities, particularly in marine environments.'
      },
      {
        ufoType: 'builder',
        reactionLevel: 65,
        description: 'Concerns about permanent bases in remote areas or underwater.'
      }
    ]
  }
};