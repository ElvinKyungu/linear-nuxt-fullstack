// prisma/seed-tasks.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTasks() {
  const elvinUserId = 'cmel8da040000tx30rlt504pd'
  
  // Vérifier que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { id: elvinUserId }
  })
  
  if (!user) {
    console.log('❌ Utilisateur Elvin Kyungu non trouvé')
    return
  }
  
  console.log(`✅ Utilisateur trouvé: ${user.name} ${user.lastName}`)
const componentsData = [
    { id: '6f980025-ee51-4a50-b2d4-92074ed81b7e', name: 'UI Kit', color: '#FF5733' },
    { id: '2aa4ad69-3ee5-4228-9fd2-6b40ca9ac797', name: 'Backend', color: '#33FF57' },
    { id: 'a844d4e0-cc9c-49a0-8d94-1c3bc57cb01f', name: 'Design System', color: '#3357FF' },
    { id: '28d5ccf7-3bd2-4d9c-acc1-baf5f07a5c16', name: 'Docs', color: '#F3C300' },
    { id: 'bd816e7d-3a90-4ac5-a9e8-0dcb9373b4ff', name: 'Accessibility', color: '#FF33A1' },
    { id: 'dfc5cdd0-0717-415d-9c60-440988bebd9b', name: 'Auth', color: '#33FFF3' },
    { id: 'ea6d6119-6411-4c10-944e-f561483af360', name: 'Mobile', color: '#A133FF' },
    { id: 'a3036b3a-b50e-4f2d-aae0-7fbc68207df0', name: 'Navigation', color: '#FF8F33' }
  ]

  for (const comp of componentsData) {
    await prisma.component.upsert({
      where: { id: comp.id },
      update: {},
      create: { id: comp.id, name: comp.name, color: comp.color, createdAt: new Date() }
    })
  }
  console.log('✅ Composants créés ou existants OK')
  
  const tasksData = [
    {
      id: '349cfe94-6f6f-47e7-bd69-c8951a6fe2cc',
      title: 'Add Dark Mode Switcher',
      description: 'Ajouter un bouton pour basculer entre thème clair et sombre.',
      status: 'Technical Review',
      type: 'Feature',
      priority: 'Medium',
      leadId: elvinUserId,
      progress: 30,
      targetDate: new Date('2025-08-10'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: '6f980025-ee51-4a50-b2d4-92074ed81b7e'
    },
    {
      id: '372eb7d7-3512-42fc-85ae-ff3eb977927d',
      title: 'Add Multi-Language Support',
      description: 'Ajouter la gestion multilingue pour l\'interface.',
      status: 'In progress',
      type: 'Feature',
      priority: 'Medium',
      leadId: elvinUserId,
      progress: 0,
      targetDate: new Date('2025-08-12'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: '2aa4ad69-3ee5-4228-9fd2-6b40ca9ac797'
    },
    {
      id: '3d1889c8-e27f-497b-89d2-b3471f85af06',
      title: 'Redesign Tooltip Styles',
      description: 'Moderniser le style des tooltips.',
      status: 'In progress',
      type: 'Design',
      priority: 'No priority',
      leadId: elvinUserId,
      progress: 45,
      targetDate: new Date('2025-08-08'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: 'a844d4e0-cc9c-49a0-8d94-1c3bc57cb01f'
    },
    {
      id: '3d3dce53-0c7b-4bab-ad86-d27bc86625c4',
      title: 'Write documentation',
      description: 'Document all API endpoints and frontend components',
      status: 'Paused',
      type: 'Documentation',
      priority: 'Low',
      leadId: elvinUserId,
      progress: 50,
      targetDate: new Date('2025-07-30'),
      createdAt: new Date('2025-07-15T17:46:43.901Z'),
      componentId: '28d5ccf7-3bd2-4d9c-acc1-baf5f07a5c16'
    },
    {
      id: '4453f8d0-d711-4019-81a8-f9dcba3ff4ca',
      title: 'Fix Tooltip Alignment',
      description: 'Corriger le mauvais alignement des tooltips sur mobile.',
      status: 'Completed',
      type: 'Accessibility',
      priority: 'Medium',
      leadId: elvinUserId,
      progress: 100,
      targetDate: new Date('2025-07-20'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: 'bd816e7d-3a90-4ac5-a9e8-0dcb9373b4ff'
    },
    {
      id: '5a1d4344-41e4-4d14-b777-3c7bc6ad3d20',
      title: 'Implement Auth API',
      description: 'Créer le backend pour l\'authentification et la gestion des sessions.',
      status: 'Paused',
      type: 'Feature',
      priority: 'High',
      leadId: elvinUserId,
      progress: 40,
      targetDate: new Date('2025-07-15'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: 'dfc5cdd0-0717-415d-9c60-440988bebd9b'
    },
    {
      id: '5a2fe4eb-e295-4ea2-ab36-3c69d909480d',
      title: 'Fix API Pagination Bug',
      description: 'Résoudre le problème de pagination incorrecte dans l\'API.',
      status: 'Completed',
      type: 'Accessibility',
      priority: 'High',
      leadId: elvinUserId,
      progress: 100,
      targetDate: new Date('2025-07-18'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: 'ea6d6119-6411-4c10-944e-f561483af360'
    },
    {
      id: '632dc02d-5d05-43ad-9d7d-b36210bf5cbb',
      title: 'Fix Mobile Navigation Bug',
      description: 'Corriger le bug sur la navigation mobile.',
      status: 'Todo',
      type: 'Accessibility',
      priority: 'Low',
      leadId: elvinUserId,
      progress: 90,
      targetDate: new Date('2025-08-03'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: 'ea6d6119-6411-4c10-944e-f561483af360'
    },
    {
      id: '834090f4-bc2a-4e5a-907f-4c8decbd1d24',
      title: 'Redesign Navigation Bar',
      description: 'Mettre à jour le design de la navbar pour le nouveau thème.',
      status: 'Todo',
      type: 'Design',
      priority: 'Low',
      leadId: elvinUserId,
      progress: 80,
      targetDate: new Date('2025-08-01'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: 'a3036b3a-b50e-4f2d-aae0-7fbc68207df0'
    },
    {
      id: '84c0bca9-6103-4fd9-a6ae-f28958a90911',
      title: 'Optimize Sidebar Loading',
      description: 'Améliorer les performances du chargement de la sidebar.',
      status: 'Paused',
      type: 'Performance',
      priority: 'Urgent',
      leadId: elvinUserId,
      progress: 50,
      targetDate: new Date('2025-07-25'),
      createdAt: new Date('2025-07-16T17:00:05.016Z'),
      componentId: '2aa4ad69-3ee5-4228-9fd2-6b40ca9ac797'
    }
  ]

  console.log('🚀 Début de l\'insertion des tâches...')
  
  for (const taskData of tasksData) {
    try {
      // Vérifier si la tâche existe déjà
      const existingTask = await prisma.task.findUnique({
        where: { id: taskData.id }
      })
      
      if (existingTask) {
        console.log(`⚠️ Tâche "${taskData.title}" existe déjà, passage à la suivante`)
        continue
      }
      
      await prisma.task.create({
        data: taskData
      })
      
      console.log(`✅ Tâche créée: ${taskData.title}`)
    } catch (error) {
      console.error(`❌ Erreur lors de la création de "${taskData.title}":`, error)
    }
  }
  
  console.log('🎉 Insertion des tâches terminée!')
  
  // Afficher le résumé
  const totalTasks = await prisma.task.count({
    where: { leadId: elvinUserId }
  })
  
  console.log(`📊 Total des tâches pour Elvin: ${totalTasks}`)
}

async function main() {
  try {
    await seedTasks()
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()