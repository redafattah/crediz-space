'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'

export default function DigitalAgencyPage() {
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!type || !message) {
      toast.error('Tous les champs sont obligatoires.')
      return
    }

    setLoading(true)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      toast.error("Vous devez être connecté.")
      setLoading(false)
      return
    }

    const { error } = await supabase.from('client_requests').insert([
      {
        user_id: user.id,
        email: user.email,
        type,
        message,
        status: 'envoyée'
      }
    ])

    if (error) {
      toast.error('Erreur lors de la soumission.')
    } else {
      toast.success('Demande envoyée avec succès 📩')
      setType('')
      setMessage('')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Agence Digitale de Prêt</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Envoyez une demande ou posez une question à notre équipe.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="type">Type de demande</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 border border-input rounded-md p-2 text-sm bg-background"
            >
              <option value="">-- Sélectionner --</option>
              <option value="question">Question</option>
              <option value="modification">Demande de modification</option>
              <option value="rééchelonnement">Rééchelonnement</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <Label htmlFor="message">Votre message</Label>
            <Textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre demande ici..."
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
