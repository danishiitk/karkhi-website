export type Confidence = "high" | "medium" | "low";

export type Person = {
  id: string;
  name: string;
  urduName?: string;
  fatherId?: string | null;
  motherId?: string | null;
  spouseIds?: string[];
  villageId?: string;
  generation?: number;
  isPlaceholder?: boolean;
  notes?: string;
  source?: {
    pdfPages?: number[];
    confidence: Confidence;
  };
};

export type VillageTree = {
  id: string;
  slug: string;
  name: string;
  urduName: string;
  alternateSpellings?: string[];
  confidence: Confidence;
  rootPersonId: string;
  notes?: string;
};

export type DisplayTreeNode = Person & {
  children: DisplayTreeNode[];
};

export type VillageDisplayTree = {
  village: VillageTree;
  root: DisplayTreeNode;
  people: Person[];
};

export const COMMON_ROOT_ID = "sheikh-hassan";

const villageSeed = [
  {
    id: "bigra-awwal",
    slug: "bigra-awwal",
    name: "Bigra Awwal",
    urduName: "بگرا اول",
    confidence: "medium"
  },
  {
    id: "tilja",
    slug: "tilja",
    name: "Tilja",
    urduName: "تلجا",
    confidence: "medium"
  },
  {
    id: "semariyawan",
    slug: "semariyawan",
    name: "Semariyawan",
    urduName: "سہریاواں",
    alternateSpellings: ["Sehriyaon"],
    confidence: "high"
  },
  {
    id: "munda-diha-baig",
    slug: "munda-diha-baig",
    name: "Munda Diha Baig",
    urduName: "مونڈا ڈیہا مینگ",
    alternateSpellings: ["Monda Diha Meeng"],
    confidence: "high"
  },
  {
    id: "munda-diha-khurd",
    slug: "munda-diha-khurd",
    name: "Munda Diha Khurd",
    urduName: "مونڈا ڈیہا خورد",
    alternateSpellings: ["Monda Diha Khurd"],
    confidence: "high"
  },
  {
    id: "chapiya-chatawna",
    slug: "chapiya-chatawna",
    name: "Chapiya Chatawna",
    urduName: "چھپیا چھتنوا",
    alternateSpellings: ["Chhipiya Chhitnawa"],
    confidence: "high"
  },
  {
    id: "tema-rahmat",
    slug: "tema-rahmat",
    name: "Tema Rahmat",
    urduName: "تیما رحمت",
    confidence: "medium"
  },
  {
    id: "karma-doman",
    slug: "karma-doman",
    name: "Karma Doman",
    urduName: "کرما ڈومن",
    confidence: "high"
  },
  {
    id: "pipra-doman",
    slug: "pipra-doman",
    name: "Pipra Doman",
    urduName: "پیرا ڈومن",
    alternateSpellings: ["Pira Doman"],
    confidence: "medium"
  }
] satisfies Array<{
  id: string;
  slug: string;
  name: string;
  urduName: string;
  alternateSpellings?: string[];
  confidence: Confidence;
}>;

export const villages: VillageTree[] = villageSeed.map((village) => ({
  ...village,
  rootPersonId: `${village.slug}-branch`,
  notes:
    village.confidence === "high"
      ? "Village branch identified from the Urdu source list."
      : "Village branch identified from the corrected list and needs Urdu/source verification."
}));

const villageBranchPeople: Person[] = villages.map((village) => ({
  id: village.rootPersonId,
  name: village.name,
  urduName: village.urduName,
  fatherId: null,
  villageId: village.slug,
  isPlaceholder: true,
  notes:
    village.slug === "bigra-awwal"
      ? "Branch metadata for Bigra Awwal. Family 1 data has been entered from user-provided structure."
      : `Branch metadata for ${village.name}. Detailed descendants from the Urdu source are not entered yet.`,
  source: {
    confidence: village.confidence
  }
}));

const bigraAwwalPeople: Person[] = [
  {
    id: "bigra-awwal-bholai",
    name: "Bholai",
    fatherId: null,
    villageId: "bigra-awwal",
    generation: 1,
    notes: "Bigra Awwal Family 1 root, entered from user-provided structure.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-hanif-hasan",
    name: "Hanif Hasan",
    fatherId: "bigra-awwal-bholai",
    villageId: "bigra-awwal",
    generation: 2,
    notes: "Son of Bholai. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-irshad-ahmad",
    name: "Irshad Ahmad",
    fatherId: "bigra-awwal-hanif-hasan",
    villageId: "bigra-awwal",
    generation: 3,
    notes: "Son of Hanif Hasan. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-niyaz-ahmad",
    name: "Niyaz Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-faiyyaz-ahmad",
    name: "Faiyyaz Ahmad",
    fatherId: "bigra-awwal-niyaz-ahmad",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Niyaz Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-faizan-ahmad",
    name: "Faizan Ahmad",
    fatherId: "bigra-awwal-niyaz-ahmad",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Niyaz Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-nisar-ahmad",
    name: "Nisar Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-imtiyaz-ahmad",
    name: "Imtiyaz Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-hussain-ahmad",
    name: "Hussain Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-ajaz-ahmad",
    name: "Ajaz Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-kamran-ahmad",
    name: "Kamran Ahmad",
    fatherId: "bigra-awwal-ajaz-ahmad",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Ajaz Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-maddo",
    name: "Maddo",
    fatherId: "bigra-awwal-kamran-ahmad",
    villageId: "bigra-awwal",
    generation: 6,
    notes: "Son of Kamran Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-dhollu",
    name: "Dhollu",
    fatherId: "bigra-awwal-kamran-ahmad",
    villageId: "bigra-awwal",
    generation: 6,
    notes: "Son of Kamran Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-danish-ahmad",
    name: "Danish Ahmad",
    fatherId: "bigra-awwal-ajaz-ahmad",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Ajaz Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-altamash-ahmad",
    name: "Altamash Ahmad",
    fatherId: "bigra-awwal-ajaz-ahmad",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Ajaz Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-asad-ahmad",
    name: "Asad Ahmad",
    fatherId: "bigra-awwal-ajaz-ahmad",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Ajaz Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-intesar-ahmad",
    name: "Intesar Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-ansar-ahmad",
    name: "Ansar Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-ifraque-ahmad",
    name: "Ifraque Ahmad",
    fatherId: "bigra-awwal-irshad-ahmad",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Irshad Ahmad. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-abdul-hafiz",
    name: "Abdul Hafiz",
    fatherId: "bigra-awwal-hanif-hasan",
    villageId: "bigra-awwal",
    generation: 3,
    notes: "Son of Hanif Hasan. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-zainullah",
    name: "Zainullah",
    fatherId: "bigra-awwal-bholai",
    villageId: "bigra-awwal",
    generation: 2,
    notes: "Son of Bholai. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-ghulam-sarvar",
    name: "Ghulam Sarvar",
    fatherId: "bigra-awwal-zainullah",
    villageId: "bigra-awwal",
    generation: 3,
    notes: "Son of Zainullah. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-abdul-karim",
    name: "Abdul Karim",
    fatherId: "bigra-awwal-zainullah",
    villageId: "bigra-awwal",
    generation: 3,
    notes: "Son of Zainullah. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-mohd-umar",
    name: "Mohd Umar",
    fatherId: "bigra-awwal-abdul-karim",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Abdul Karim. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-abdul-mannan",
    name: "Abdul Mannan",
    fatherId: "bigra-awwal-ghulam-sarvar",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Ghulam Sarvar. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-shakeel-ahmad",
    name: "Shakeel Ahmad",
    fatherId: "bigra-awwal-ghulam-sarvar",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Ghulam Sarvar. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-anwar-ahmad",
    name: "Anwar Ahmad",
    fatherId: "bigra-awwal-ghulam-sarvar",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Ghulam Sarvar. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-aqbal-ahmad",
    name: "Aqbal Ahmad",
    fatherId: "bigra-awwal-ghulam-sarvar",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Ghulam Sarvar. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-matiul-haq",
    name: "Matiul Haq",
    fatherId: "bigra-awwal-ghulam-sarvar",
    villageId: "bigra-awwal",
    generation: 4,
    notes: "Son of Ghulam Sarvar. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-rafiuddin",
    name: "Rafiuddin",
    fatherId: "bigra-awwal-matiul-haq",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Matiul Haq. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  },
  {
    id: "bigra-awwal-mohd-ahmad",
    name: "Mohd Ahmad",
    fatherId: "bigra-awwal-matiul-haq",
    villageId: "bigra-awwal",
    generation: 5,
    notes: "Son of Matiul Haq. Bigra Awwal Family 1.",
    source: {
      confidence: "high"
    }
  }
];

export const people: Person[] = [
  {
    id: COMMON_ROOT_ID,
    name: "Sheikh Hasan",
    urduName: "شیخ حسن",
    fatherId: null,
    notes: "Known common ancestor, shown as context above village family trees. Alternate spelling: Sheikh Hassan.",
    source: {
      confidence: "high"
    }
  },
  ...villageBranchPeople,
  ...bigraAwwalPeople
];

// TODO: Future admin tooling can attach submission, approval, and audit metadata beside Person.source.

export function getVillageBySlug(slug: string) {
  return villages.find((village) => village.slug === slug);
}

export function getPersonById(id: string) {
  return people.find((person) => person.id === id);
}

export function getChildren(personId: string) {
  return people
    .filter((person) => person.fatherId === personId)
    .sort((a, b) => {
      const generationDelta = (a.generation ?? 0) - (b.generation ?? 0);
      return generationDelta || a.name.localeCompare(b.name);
    });
}

export function buildVillageDisplayTree(villageSlug: string): VillageDisplayTree | null {
  const village = getVillageBySlug(villageSlug);
  const root = getPersonById(COMMON_ROOT_ID);

  if (!village || !root) {
    return null;
  }

  const buildPersonTree = (person: Person): DisplayTreeNode => ({
    ...person,
    children: getChildren(person.id)
      .filter((child) => child.villageId === village.slug)
      .map(buildPersonTree)
  });

  const familyRoots = people
    .filter(
      (person) =>
        person.villageId === village.slug &&
        !person.isPlaceholder &&
        !person.fatherId
    )
    .sort((a, b) => {
      const generationDelta = (a.generation ?? 0) - (b.generation ?? 0);
      return generationDelta || a.name.localeCompare(b.name);
    });

  const treeRoot: DisplayTreeNode = {
    ...root,
    children: familyRoots.map(buildPersonTree)
  };

  const collectPeople = (node: DisplayTreeNode): Person[] => [
    node,
    ...node.children.flatMap(collectPeople)
  ];

  return {
    village,
    root: treeRoot,
    people: collectPeople(treeRoot)
  };
}
